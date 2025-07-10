// Global variables
let chart;
let growthData = null; // Will be loaded from external JSON files
let savedDataPoints = []; // Array to store multiple saved points
let currentPlotPoint = null; // Temporarily plotted point (before saving)

// Colors for different saved points
const POINT_COLORS = [
    '#ff3838', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0',
    '#607D8B', '#795548', '#E91E63', '#009688', '#FFC107',
    '#3F51B5', '#8BC34A', '#FF5722', '#673AB7', '#CDDC39'
];

/**
 * Load growth data from external JSON files
 */
async function loadGrowthData() {
    try {
        // Load both data files in parallel
        const [whoCdcResponse, hk2020Response] = await Promise.all([
            fetch('./data/who-cdc-growth-data.json'),
            fetch('./data/hk2020-growth-data.json')
        ]);

        if (!whoCdcResponse.ok || !hk2020Response.ok) {
            throw new Error('Failed to load growth data files');
        }

        const whoCdcData = await whoCdcResponse.json();
        const hk2020Data = await hk2020Response.json();

        // Combine the data
        growthData = {
            who_cdc: whoCdcData,
            hk2020: hk2020Data
        };

        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';
        
        // Load saved points from localStorage
        loadSavedPoints();
        
        // Initialize chart after data is loaded
        initChart();
        updateLegend();
        
        console.log('Growth data loaded successfully');
    } catch (error) {
        console.error('Error loading growth data:', error);
        
        // Hide loading indicator and show error
        document.getElementById('loading').style.display = 'none';
        showInfo('Error loading growth chart data. Please refresh the page.', 'error');
    }
}

/**
 * Load saved points from localStorage
 */
function loadSavedPoints() {
    try {
        const saved = localStorage.getItem('growthChart_savedPoints');
        if (saved) {
            savedDataPoints = JSON.parse(saved);
            updateSavedPointsList();
        }
    } catch (error) {
        console.error('Error loading saved points:', error);
        savedDataPoints = [];
    }
}

/**
 * Save points to localStorage
 */
function saveSavedPoints() {
    try {
        localStorage.setItem('growthChart_savedPoints', JSON.stringify(savedDataPoints));
    } catch (error) {
        console.error('Error saving points to localStorage:', error);
    }
}

/**
 * Initialize the Chart.js chart
 */
function initChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Age (years)'
                    },
                    min: 0,
                    max: 18
                },
                y: {
                    title: {
                        display: true,
                        text: 'Height (cm)'
                    },
                    min: 40,
                    max: 200
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'nearest',
                    enable: true,
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            const point = context[0];
                            if (point.dataset.pointData) {
                                const data = point.dataset.pointData;
                                return data.label || `${data.gender === 'boy' ? 'Boy' : 'Girl'} - ${data.age} years`;
                            }
                            return `Age: ${point.parsed.x} years`;
                        },
                        label: function(context) {
                            const point = context.dataset.pointData;
                            if (point) {
                                return [
                                    `Height: ${point.height} cm`,
                                    `Percentile: ${point.percentile}`,
                                    `Standard: ${point.standard === 'who_cdc' ? 'WHO/CDC' : 'Hong Kong 2020'}`,
                                    `Date: ${point.date}`
                                ];
                            }
                            return `${context.dataset.label}: ${context.parsed.y} cm`;
                        },
                        afterLabel: function(context) {
                            const datasetLabel = context.dataset.label;
                            if (datasetLabel.includes('Saved:') || datasetLabel === 'Current Plot') {
                                return 'Growth measurement';
                            }
                            return 'Growth percentile curve';
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 1,
                    hoverRadius: 6,
                    hoverBorderWidth: 2
                },
                line: {
                    borderWidth: 2,
                    hoverBorderWidth: 3
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
    
    updateChart();
}

/**
 * Update the legend display
 */
function updateLegend() {
    const standard = document.getElementById('standard').value;
    const legendDiv = document.getElementById('legend');
    
    const legendData = standard === 'who_cdc' ? {
        'p3': { color: '#ff6b6b', label: '3rd Percentile' },
        'p10': { color: '#feca57', label: '10th Percentile' },
        'p25': { color: '#48dbfb', label: '25th Percentile' },
        'p50': { color: '#0abde3', label: '50th Percentile (Median)' },
        'p75': { color: '#48dbfb', label: '75th Percentile' },
        'p90': { color: '#feca57', label: '90th Percentile' },
        'p97': { color: '#ff6b6b', label: '97th Percentile' }
    } : {
        'p0_4': { color: '#d63031', label: '0.4th Percentile' },
        'p2': { color: '#e17055', label: '2nd Percentile' },
        'p9': { color: '#fdcb6e', label: '9th Percentile' },
        'p25': { color: '#74b9ff', label: '25th Percentile' },
        'p50': { color: '#0984e3', label: '50th Percentile (Median)' },
        'p75': { color: '#6c5ce7', label: '75th Percentile' },
        'p91': { color: '#a29bfe', label: '91st Percentile' },
        'p98': { color: '#fd79a8', label: '98th Percentile' },
        'p99_6': { color: '#e84393', label: '99.6th Percentile' }
    };
    
    legendDiv.innerHTML = '';
    Object.entries(legendData).forEach(([key, data]) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${data.color};"></div>
            <span>${data.label}</span>
        `;
        legendDiv.appendChild(legendItem);
    });
}

/**
 * Update the chart with current data
 */
function updateChart() {
    // Check if data is loaded
    if (!growthData) {
        console.log('Growth data not yet loaded, skipping chart update');
        return;
    }
    
    const standard = document.getElementById('standard').value;
    const gender = document.getElementById('gender').value;
    const data = growthData[standard][gender];
    
    const colors = standard === 'who_cdc' ? {
        p3: '#ff6b6b',
        p10: '#feca57',
        p25: '#48dbfb',
        p50: '#0abde3',
        p75: '#48dbfb',
        p90: '#feca57',
        p97: '#ff6b6b'
    } : {
        p0_4: '#d63031',
        p2: '#e17055',
        p9: '#fdcb6e',
        p25: '#74b9ff',
        p50: '#0984e3',
        p75: '#6c5ce7',
        p91: '#a29bfe',
        p98: '#fd79a8',
        p99_6: '#e84393'
    };

    chart.data.datasets = [];
    
    // Add percentile lines
    Object.keys(data.percentiles).forEach(percentile => {
        const percentileData = data.ages.map((age, index) => ({
            x: age / 12, // Convert months to years for display
            y: data.percentiles[percentile][index]
        }));
        
        let label = percentile.replace('p', '').replace('_', '.') + 'th Percentile';
        if (percentile === 'p50') label += ' (Median)';
        
        chart.data.datasets.push({
            label: label,
            data: percentileData,
            borderColor: colors[percentile],
            backgroundColor: colors[percentile],
            borderWidth: percentile === 'p50' ? 3 : 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
        });
    });
    
    // Add saved data points (each as its own dataset)
    savedDataPoints.forEach((point, index) => {
        const color = POINT_COLORS[index % POINT_COLORS.length];
        chart.data.datasets.push({
            label: `Saved: ${point.label || `Point ${index + 1}`}`,
            data: [{ x: point.age, y: point.height }],
            backgroundColor: color,
            borderColor: color,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointStyle: 'crossRot',
            pointRotation: 45,
            showLine: false,
            order: -10,
            pointData: point // Store full point data for tooltips
        });
    });
    
    // Add current plot point if exists (temporary, before saving)
    if (currentPlotPoint) {
        chart.data.datasets.push({
            label: 'Current Plot',
            data: [{ x: currentPlotPoint.age, y: currentPlotPoint.height }],
            backgroundColor: '#FF6B35',
            borderColor: '#FF6B35',
            borderWidth: 3,
            pointRadius: 7,
            pointHoverRadius: 9,
            pointStyle: 'crossRot',
            pointRotation: 45,
            showLine: false,
            order: -20,
            pointData: currentPlotPoint // Store full point data for tooltips
        });
    }
    
    updateLegend();
    chart.update();
}

/**
 * Plot a point on the chart (temporary)
 */
function plotPoint() {
    // Check if data is loaded
    if (!growthData) {
        showInfo('Growth data is still loading. Please wait a moment and try again.', 'error');
        return;
    }
    
    const standard = document.getElementById('standard').value;
    const gender = document.getElementById('gender').value;
    const ageYears = parseFloat(document.getElementById('age').value);
    const height = parseFloat(document.getElementById('height').value);
    const label = document.getElementById('pointLabel').value.trim();
    
    // Validation
    if (isNaN(ageYears) || isNaN(height)) {
        showInfo('Please enter valid numbers for age and height.', 'error');
        return;
    }
    
    if (ageYears < 0 || ageYears > 18) {
        showInfo('Age must be between 0 and 18 years.', 'error');
        return;
    }
    
    if (height < 30 || height > 200) {
        showInfo('Height must be between 30 and 200 cm.', 'error');
        return;
    }
    
    // Convert years to months for calculations
    const ageMonths = ageYears * 12;
    
    // Calculate percentile (using months)
    const percentile = calculatePercentile(standard, gender, ageMonths, height);
    
    // Create current plot point (display in years)
    currentPlotPoint = {
        id: Date.now(),
        label: label || null,
        standard: standard,
        gender: gender,
        age: ageYears,
        height: height,
        percentile: percentile,
        date: new Date().toLocaleDateString()
    };
    
    // Update chart
    updateChart();
    
    // Show info
    const standardName = standard === 'who_cdc' ? 'WHO/CDC' : 'Hong Kong 2020';
    showInfo(`Plotted: ${gender === 'boy' ? 'Boy' : 'Girl'}, ${ageYears} years old, ${height} cm tall. Approximately ${percentile} percentile (${standardName} standard). Click "Save Point" to permanently save this measurement.`);
}

/**
 * Save the current plot point permanently
 */
function savePoint() {
    if (!currentPlotPoint) {
        showInfo('Please plot a point first before saving.', 'error');
        return;
    }
    
    // Add to saved points
    savedDataPoints.push({ ...currentPlotPoint });
    
    // Clear current plot point
    currentPlotPoint = null;
    
    // Save to localStorage
    saveSavedPoints();
    
    // Update displays
    updateChart();
    updateSavedPointsList();
    
    // Clear the form
    document.getElementById('pointLabel').value = '';
    
    showInfo(`Point saved successfully! You now have ${savedDataPoints.length} saved measurement${savedDataPoints.length === 1 ? '' : 's'}.`);
}

/**
 * Delete a specific saved point
 */
function deletePoint(pointId) {
    savedDataPoints = savedDataPoints.filter(point => point.id !== pointId);
    saveSavedPoints();
    updateChart();
    updateSavedPointsList();
    
    if (savedDataPoints.length === 0) {
        showInfo('All points cleared.', 'info');
    } else {
        showInfo(`Point deleted. ${savedDataPoints.length} measurement${savedDataPoints.length === 1 ? '' : 's'} remaining.`);
    }
}

/**
 * Clear all saved points
 */
function clearAllPoints() {
    if (savedDataPoints.length === 0) {
        showInfo('No saved points to clear.', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete all ${savedDataPoints.length} saved measurements? This cannot be undone.`)) {
        savedDataPoints = [];
        currentPlotPoint = null;
        saveSavedPoints();
        updateChart();
        updateSavedPointsList();
        showInfo('All saved measurements have been cleared.', 'info');
    }
}

/**
 * Update the saved points list display
 */
function updateSavedPointsList() {
    const section = document.getElementById('savedPointsSection');
    const list = document.getElementById('savedPointsList');
    
    if (savedDataPoints.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    list.innerHTML = '';
    
    savedDataPoints.forEach((point, index) => {
        const color = POINT_COLORS[index % POINT_COLORS.length];
        const standardName = point.standard === 'who_cdc' ? 'WHO/CDC' : 'HK 2020';
        
        const item = document.createElement('div');
        item.className = 'saved-point-item';
        item.innerHTML = `
            <div class="saved-point-info">
                <div style="display: flex; align-items: center;">
                    <div class="saved-point-marker" style="background-color: ${color};"></div>
                    <span class="saved-point-label">${point.label || `Measurement ${index + 1}`}</span>
                </div>
                <div class="saved-point-details">
                    ${point.gender === 'boy' ? 'Boy' : 'Girl'} • ${point.age} years • ${point.height} cm • ${point.percentile} percentile • ${standardName} • ${point.date}
                </div>
            </div>
            <button onclick="deletePoint(${point.id})" class="button-danger button-small">Delete</button>
        `;
        list.appendChild(item);
    });
}

/**
 * Calculate percentile for given measurements
 */
function calculatePercentile(standard, gender, ageMonths, height) {
    const data = growthData[standard][gender];
    
    // Find the closest age points for interpolation
    let lowerIndex = 0;
    let upperIndex = data.ages.length - 1;
    
    for (let i = 0; i < data.ages.length - 1; i++) {
        if (ageMonths >= data.ages[i] && ageMonths <= data.ages[i + 1]) {
            lowerIndex = i;
            upperIndex = i + 1;
            break;
        }
    }
    
    // Interpolate percentile values for the given age
    const ageFactor = upperIndex === lowerIndex ? 0 : (ageMonths - data.ages[lowerIndex]) / (data.ages[upperIndex] - data.ages[lowerIndex]);
    
    // Different percentile structures for different standards
    const percentiles = standard === 'who_cdc' 
        ? ['p3', 'p10', 'p25', 'p50', 'p75', 'p90', 'p97']
        : ['p0_4', 'p2', 'p9', 'p25', 'p50', 'p75', 'p91', 'p98', 'p99_6'];
    
    const percentileValues = standard === 'who_cdc'
        ? [3, 10, 25, 50, 75, 90, 97]
        : [0.4, 2, 9, 25, 50, 75, 91, 98, 99.6];
    
    for (let i = 0; i < percentiles.length; i++) {
        const lowerHeight = data.percentiles[percentiles[i]][lowerIndex];
        const upperHeight = data.percentiles[percentiles[i]][upperIndex];
        const interpolatedHeight = lowerHeight + ageFactor * (upperHeight - lowerHeight);
        
        if (height <= interpolatedHeight) {
            if (i === 0) return `<${percentileValues[i]}th`;
            
            // Interpolate between this and previous percentile
            const prevPercentile = percentiles[i - 1];
            const prevLowerHeight = data.percentiles[prevPercentile][lowerIndex];
            const prevUpperHeight = data.percentiles[prevPercentile][upperIndex];
            const prevInterpolatedHeight = prevLowerHeight + ageFactor * (prevUpperHeight - prevLowerHeight);
            
            const heightFactor = (height - prevInterpolatedHeight) / (interpolatedHeight - prevInterpolatedHeight);
            const estimatedPercentile = percentileValues[i - 1] + heightFactor * (percentileValues[i] - percentileValues[i - 1]);
            
            return `${Math.round(estimatedPercentile * 10) / 10}th`;
        }
    }
    
    return standard === 'who_cdc' ? '>97th' : '>99.6th';
}

/**
 * Show information message to user
 */
function showInfo(message, type = 'info') {
    const infoDiv = document.getElementById('info');
    infoDiv.textContent = message;
    infoDiv.className = 'info-box' + (type === 'error' ? ' error' : '');
    infoDiv.style.display = 'block';
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load growth data first, then initialize chart
    loadGrowthData();
    
    // Update chart when standard or gender changes
    document.getElementById('standard').addEventListener('change', updateChart);
    document.getElementById('gender').addEventListener('change', updateChart);
}); 