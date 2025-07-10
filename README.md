# Growth Chart Plotter

An interactive growth chart tool for children 0-18 years that allows plotting height percentiles using WHO/CDC International or Hong Kong 2020 growth standards with multi-point tracking capabilities.

## Features

- **Interactive Chart**: Plot child's height against growth percentile curves
- **Multi-Point Tracking**: Save and track multiple measurements over time
- **Dual Standards**: Switch between WHO/CDC International and Hong Kong 2020 standards
- **Real-time Calculation**: Automatic percentile calculation and display
- **Persistent Storage**: Saved measurements persist across browser sessions
- **Responsive Design**: Works on desktop and mobile devices
- **Accurate Data**: Uses official growth survey data

## Data Sources

- **WHO/CDC International**: Based on WHO Child Growth Standards (2006) from 6-country study
- **Hong Kong 2020**: Based on Hong Kong Growth Survey 2020-22 by Chinese University of Hong Kong

## Project Structure

### ✅ **Current Architecture (Modern & Maintainable)**

```
growth-curves/
├── index.html                      # Clean HTML structure (180 lines)
├── styles.css                      # All CSS styles (291 lines)
├── script.js                       # JavaScript functionality (557 lines)
├── data/
│   ├── who-cdc-growth-data.json    # WHO/CDC International data
│   └── hk2020-growth-data.json     # Hong Kong 2020 data
├── scripts/
│   ├── get_data_hk.py              # Data extraction script (regenerates HK data)
│   └── validate_data.py            # Data validation utilities
├── reference/                      # Source documentation and PDFs
└── README.md                       # This documentation
```

### 🚀 **Architecture Benefits**

- **Separation of Concerns**: HTML, CSS, and JavaScript in separate files
- **Maintainability**: Easy to update styles/behavior without affecting structure
- **Performance**: Smaller files, better caching, parallel loading
- **Modularity**: Components can be reused and modified independently
- **Team Development**: Multiple developers can work on different aspects
- **Version Control**: Clean, focused diffs for changes
- **Professional Standards**: Follows modern web development best practices

### 📊 **File Size Comparison**

| Approach | HTML Size | Benefits |
|----------|-----------|----------|
| **Previous** | 887 lines | Monolithic, hard to maintain |
| **Current** | 180 lines | Modular, professional, scalable |

## Technical Implementation

### Modern JavaScript Features
```javascript
// Parallel data loading with Promise.all()
async function loadGrowthData() {
    const [whoCdcResponse, hk2020Response] = await Promise.all([
        fetch('./data/who-cdc-growth-data.json'),
        fetch('./data/hk2020-growth-data.json')
    ]);
    
    // Error handling and graceful degradation
    if (!whoCdcResponse.ok || !hk2020Response.ok) {
        throw new Error('Failed to load growth data files');
    }
}
```

### Multi-Point Tracking System
- **localStorage Integration**: Persistent data across sessions
- **Visual Management**: Color-coded saved points with labels
- **Comprehensive Metadata**: Tracks standard, gender, age, height, percentile, date
- **User-Friendly Interface**: Easy save/delete with confirmations

### Error Handling & UX
- Loading indicators during data fetch
- Fallback messages for failed requests
- Form validation and user feedback
- Responsive design with mobile breakpoints

## Development

### Working with Growth Data

**Data Structure:**
```json
{
  "boy": {
    "ages": [0, 3, 6, 9, 12, ...],     // Age in months
    "percentiles": {
      "p0_4": [...],   // Height values at each age
      "p2": [...],
      "p50": [...],    // Median
      "p99_6": [...]
    }
  },
  "girl": { /* same structure */ }
}
```

### Regenerating Hong Kong Data

To update the Hong Kong growth data from the official CSV source:

```bash
# Navigate to project directory
cd growth-curves

# Ensure the CSV file exists in reference/ directory
ls reference/HK-2020-StandardTables_v2.csv

# Run the extraction script
python3 scripts/get_data_hk.py

# Script automatically:
# ✅ Extracts data from CSV source
# ✅ Converts to application-ready JSON format
# ✅ Saves to data/hk2020-growth-data.json
# ✅ Validates data integrity (87 data points, 9 percentiles)
# ✅ Provides colorful progress feedback
```

### Data Validation

```bash
# Validate existing data files
python3 scripts/validate_data.py

# Check data consistency and format
```

### Adding New Growth Standards

1. **Create Data File**: Add new JSON file in `data/` directory
2. **Follow Format**: Use existing data structure pattern
3. **Update Code**: Modify `loadGrowthData()` in `script.js`
4. **Add UI Option**: Include new standard in dropdown

### Development Server

```bash
# For Python 3
python3 -m http.server 8000

# For Node.js
npx http-server

# Then visit: http://localhost:8000
```

## Deployment

### Static Hosting (Recommended)
- **Platforms**: Cloudflare Pages, Netlify, GitHub Pages, Vercel
- **Requirements**: Serve JSON files with correct MIME type
- **Optimization**: Enable gzip compression for performance

### CORS Considerations
- JSON files must be served from same origin
- Use proper web server (not `file://` protocol)
- Configure headers for API access if needed

## Features Overview

### 🎯 **Core Functionality**
- Height percentile plotting for children 0-18 years
- WHO/CDC International vs Hong Kong 2020 standards
- Real-time percentile calculation with interpolation

### 💾 **Multi-Point System**
- Save unlimited measurements with custom labels
- Visual tracking with color-coded crosses (⨯)
- Persistent storage across browser sessions
- Individual point management (edit/delete)

### 📱 **User Experience**
- Responsive design for all devices
- Loading indicators and error handling
- Comprehensive tooltips and information
- Accessibility-friendly interface

### 🔧 **Technical Excellence**
- Modern ES6+ JavaScript with async/await
- Chart.js integration for interactive visualizations
- Clean separation of concerns (HTML/CSS/JS)
- Professional code documentation

## Best Practices Demonstrated

1. **Modern JavaScript**: ES6+ async/await, Promise.all(), arrow functions
2. **Performance**: Parallel loading, efficient data structures, caching
3. **User Experience**: Loading states, error boundaries, validation
4. **Code Quality**: JSDoc documentation, consistent naming, modularity
5. **Accessibility**: Semantic HTML, responsive design, keyboard navigation
6. **Maintainability**: Separated concerns, clear file structure, comments

## Medical Disclaimer

This tool is for reference and educational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for proper growth assessment and medical advice.

## License

Educational/Reference tool - see individual data sources for licensing terms.