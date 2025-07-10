#!/usr/bin/env python3
"""
Hong Kong 2020 Growth Chart Data Extractor

This script extracts growth chart data from the official Hong Kong 2020 Growth Survey CSV file
and formats it for use in JavaScript/HTML applications.

Source: HK-2020-StandardTables_v2.csv
Survey: Hong Kong Growth Survey 2020-22 conducted by Chinese University of Hong Kong 
         and University of Hong Kong

CSV Structure:
- Column 0: Age in months
- Columns 5-13: Girls percentiles (0.4th, 2nd, 9th, 25th, 50th, 75th, 91st, 98th, 99.6th)
- Columns 17-25: Boys percentiles (0.4th, 2nd, 9th, 25th, 50th, 75th, 91st, 98th, 99.6th)
"""

import csv
import json


def extract_hk_growth_data(csv_file_path='reference/HK-2020-StandardTables_v2.csv'):
    """
    Extract Hong Kong 2020 growth chart data from CSV file.
    
    Args:
        csv_file_path (str): Path to the CSV file
        
    Returns:
        dict: Structured growth data for boys and girls
    """
    
    boys_data = {
        'ages': [],
        'p0_4': [],   # 0.4th percentile
        'p2': [],     # 2nd percentile
        'p9': [],     # 9th percentile
        'p25': [],    # 25th percentile
        'p50': [],    # 50th percentile (median)
        'p75': [],    # 75th percentile
        'p91': [],    # 91st percentile
        'p98': [],    # 98th percentile
        'p99_6': []   # 99.6th percentile
    }
    
    girls_data = {
        'ages': [],
        'p0_4': [],   # 0.4th percentile
        'p2': [],     # 2nd percentile
        'p9': [],     # 9th percentile
        'p25': [],    # 25th percentile
        'p50': [],    # 50th percentile (median)
        'p75': [],    # 75th percentile
        'p91': [],    # 91st percentile
        'p98': [],    # 98th percentile
        'p99_6': []   # 99.6th percentile
    }
    
    try:
        with open(csv_file_path, 'r') as f:
            reader = csv.reader(f)
            next(reader)  # Skip first header row
            next(reader)  # Skip second header row
            
            for row in reader:
                try:
                    age_months = int(float(row[0]))
                    
                    # Girls data: columns 5-13
                    girls_data['ages'].append(age_months)
                    girls_data['p0_4'].append(float(row[5]))   # Girls cent0.4
                    girls_data['p2'].append(float(row[6]))     # Girls cent2
                    girls_data['p9'].append(float(row[7]))     # Girls cent9
                    girls_data['p25'].append(float(row[8]))    # Girls cent25
                    girls_data['p50'].append(float(row[9]))    # Girls cent50
                    girls_data['p75'].append(float(row[10]))   # Girls cent75
                    girls_data['p91'].append(float(row[11]))   # Girls cent91
                    girls_data['p98'].append(float(row[12]))   # Girls cent98
                    girls_data['p99_6'].append(float(row[13])) # Girls cent99.6
                    
                    # Boys data: columns 17-25
                    boys_data['ages'].append(age_months)
                    boys_data['p0_4'].append(float(row[17]))   # Boys cent0.4
                    boys_data['p2'].append(float(row[18]))     # Boys cent2
                    boys_data['p9'].append(float(row[19]))     # Boys cent9
                    boys_data['p25'].append(float(row[20]))    # Boys cent25
                    boys_data['p50'].append(float(row[21]))    # Boys cent50
                    boys_data['p75'].append(float(row[22]))    # Boys cent75
                    boys_data['p91'].append(float(row[23]))    # Boys cent91
                    boys_data['p98'].append(float(row[24]))    # Boys cent98
                    boys_data['p99_6'].append(float(row[25]))  # Boys cent99.6
                    
                except (ValueError, IndexError):
                    # Skip rows with invalid data
                    continue
                    
    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_file_path}")
        return None
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return None
    
    return {
        'boy': boys_data,
        'girl': girls_data
    }


def format_for_javascript(data):
    """
    Format the extracted data for use in JavaScript.
    
    Args:
        data (dict): Growth data from extract_hk_growth_data()
        
    Returns:
        str: JavaScript-formatted data structure
    """
    
    if not data:
        return None
    
    js_output = []
    
    for gender in ['boy', 'girl']:
        gender_data = data[gender]
        
        js_output.append(f"                {gender}: {{")
        js_output.append(f"                    // Hong Kong 2020 Growth Survey 2020-22 - ALL data from official CSV ({len(gender_data['ages'])} data points)")
        js_output.append(f"                    // Source: HK-2020-StandardTables_v2.csv")
        js_output.append(f"                    ages: {gender_data['ages']},")
        js_output.append(f"                    percentiles: {{")
        
        percentiles = ['p0_4', 'p2', 'p9', 'p25', 'p50', 'p75', 'p91', 'p98', 'p99_6']
        percentile_labels = ['0.4th', '2nd', '9th', '25th', '50th', '75th', '91st', '98th', '99.6th']
        
        for i, (p_key, p_label) in enumerate(zip(percentiles, percentile_labels)):
            comma = "," if i < len(percentiles) - 1 else ""
            js_output.append(f"                        {p_key}: {gender_data[p_key]}{comma} // {p_label} percentile")
        
        js_output.append(f"                    }}")
        
        if gender == 'boy':
            js_output.append(f"                }},")
        else:
            js_output.append(f"                }}")
    
    return "\n".join(js_output)


def main():
    """Main function to extract and display Hong Kong growth data."""
    
    print("Hong Kong 2020 Growth Chart Data Extractor")
    print("=" * 50)
    
    # Extract data from CSV
    print("Extracting data from CSV file...")
    data = extract_hk_growth_data()
    
    if not data:
        print("Failed to extract data. Please check the CSV file path and format.")
        return
    
    # Display summary
    total_points = len(data['boy']['ages'])
    age_range_months = (min(data['boy']['ages']), max(data['boy']['ages']))
    age_range_years = (age_range_months[0] / 12, age_range_months[1] / 12)
    
    print(f"Successfully extracted {total_points} data points")
    print(f"Age range: {age_range_months[0]} to {age_range_months[1]} months ({age_range_years[0]:.1f} to {age_range_years[1]:.1f} years)")
    print()
    
    # Format for JavaScript
    print("JavaScript-formatted data structure:")
    print("=" * 50)
    js_formatted = format_for_javascript(data)
    if js_formatted:
        print("            hk2020: {")
        print(js_formatted)
        print("            }")
    
    # Save to JSON file for backup
    try:
        with open('hk2020_growth_data.json', 'w') as f:
            json.dump(data, f, indent=2)
        print(f"\nData also saved to 'hk2020_growth_data.json' for backup")
    except Exception as e:
        print(f"Warning: Could not save JSON backup: {e}")
    
    # Sample data verification
    print(f"\nSample verification:")
    print(f"Boys 18 years (216 months) - 50th percentile: {data['boy']['p50'][-1]} cm")
    print(f"Girls 18 years (216 months) - 50th percentile: {data['girl']['p50'][-1]} cm")


if __name__ == "__main__":
    main() 