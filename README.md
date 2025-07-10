# Growth Chart Plotter

An interactive growth chart tool for children 0-18 years that allows plotting height percentiles using WHO/CDC International or Hong Kong 2020 growth standards.

## Features

- **Interactive Chart**: Plot child's height against growth percentile curves
- **Dual Standards**: Switch between WHO/CDC International and Hong Kong 2020 standards
- **Real-time Calculation**: Automatic percentile calculation and display
- **Responsive Design**: Works on desktop and mobile devices
- **Accurate Data**: Uses official growth survey data

## Data Sources

- **WHO/CDC International**: Based on WHO Child Growth Standards (2006) from 6-country study
- **Hong Kong 2020**: Based on Hong Kong Growth Survey 2020-22 by Chinese University of Hong Kong

## Architecture Improvements

This project has been refactored to follow better practices:

### ✅ **Current Approach (Recommended)**

**Structure:**
```
growth-curves/
├── index.html              # Main application (clean, focused)
├── data/
│   ├── who-cdc-growth-data.json    # WHO/CDC data
│   └── hk2020-growth-data.json     # Hong Kong 2020 data
└── get_data_hk.py          # Data extraction script (regenerates HK data from CSV)
```

**Benefits:**
- **Separation of Concerns**: Data separated from presentation logic
- **Maintainability**: Easy to update data without touching code
- **File Size**: Smaller HTML file (~150 lines vs ~640 lines)
- **Modularity**: Data can be reused in other applications
- **Version Control**: Clear diffs when data changes
- **Performance**: Parallel loading of data files
- **Error Handling**: Graceful handling of missing data files

**Loading Process:**
1. Page loads with loading indicator
2. Fetch data files in parallel using `Promise.all()`
3. Initialize chart after data loads
4. Hide loading indicator and display chart

### ❌ **Previous Approach (Not Recommended)**

**Problems:**
- All data hardcoded in HTML file (400+ lines of data)
- Mixed concerns (data + presentation)
- Large file size and difficult maintenance
- No error handling for data loading
- Harder to add new growth standards

## Technical Implementation

### Data Loading
```javascript
async function loadGrowthData() {
    // Load both data files in parallel
    const [whoCdcResponse, hk2020Response] = await Promise.all([
        fetch('./data/who-cdc-growth-data.json'),
        fetch('./data/hk2020-growth-data.json')
    ]);
    
    // Combine data and initialize chart
    growthData = {
        who_cdc: whoCdcData,
        hk2020: hk2020Data
    };
}
```

### Error Handling
- Loading indicators during data fetch
- Fallback messages for failed requests
- Validation checks before chart operations

### Data Structure
```json
{
  "boy": {
    "ages": [0, 1, 2, ...],
    "percentiles": {
      "p3": [...],
      "p50": [...],
      "p97": [...]
    }
  },
  "girl": { ... }
}
```

## Development

### Adding New Growth Standards

1. Create new JSON file in `data/` directory
2. Follow existing data structure format
3. Update `loadGrowthData()` function
4. Add new standard to dropdown options

### Data Sources

- **WHO/CDC**: https://www.who.int/tools/child-growth-standards
- **Hong Kong 2020**: Official CSV from HK Growth Survey 2020-22
- **Data Extraction**: Use `python3 get_data_hk.py` to regenerate HK data from CSV source

### Regenerating Hong Kong Data

To update the Hong Kong growth data from the official CSV:

```bash
# Ensure the CSV file exists in reference/ directory
ls reference/HK-2020-StandardTables_v2.csv

# Run the extraction script
python3 get_data_hk.py

# Script will automatically:
# - Extract data from CSV
# - Format for application architecture
# - Save to data/hk2020-growth-data.json
# - Validate data integrity
```

## Deployment

### Static Hosting (Recommended)
- Works with any static file hosting (Cloudflare Pages, Netlify, GitHub Pages)
- Ensure JSON files are served with correct MIME type
- Enable gzip compression for better performance

### CORS Considerations
- JSON files must be served from same origin
- For development, use local server (not `file://` protocol)

## Best Practices Demonstrated

1. **Async/Await**: Modern JavaScript for handling data loading
2. **Promise.all()**: Parallel loading for better performance
3. **Error Boundaries**: Graceful degradation when data fails to load
4. **Loading States**: User feedback during data fetching
5. **Data Validation**: Checks before performing operations
6. **Modular Architecture**: Clean separation of data and logic

## Medical Disclaimer

This tool is for reference and educational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for proper growth assessment and medical advice.

## License

Educational/Reference tool - see individual data sources for licensing terms.