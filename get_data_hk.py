#!/usr/bin/env python3
"""
Hong Kong 2020 Growth Chart Data Extractor

This script extracts growth chart data from the official Hong Kong 2020 Growth Survey CSV file
and formats it for the new application architecture.

Source: HK-2020-StandardTables_v2.csv
Survey: Hong Kong Growth Survey 2020-22 conducted by Chinese University of Hong Kong 
         and University of Hong Kong

CSV Structure:
- Column 0: Age in months
- Columns 5-13: Girls percentiles (0.4th, 2nd, 9th, 25th, 50th, 75th, 91st, 98th, 99.6th)
- Columns 17-25: Boys percentiles (0.4th, 2nd, 9th, 25th, 50th, 75th, 91st, 98th, 99.6th)

Output: data/hk2020-growth-data.json (new nested structure)
"""

import csv
import json
import os


def extract_hk_growth_data(csv_file_path='reference/HK-2020-StandardTables_v2.csv'):
    """
    Extract Hong Kong 2020 growth chart data from CSV file.
    
    Args:
        csv_file_path (str): Path to the CSV file
        
    Returns:
        dict: Structured growth data for boys and girls in new nested format
    """
    
    # Initialize data structure to match the new application format
    boys_ages = []
    boys_percentiles = {
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
    
    girls_ages = []
    girls_percentiles = {
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
                    girls_ages.append(age_months)
                    girls_percentiles['p0_4'].append(float(row[5]))   # Girls cent0.4
                    girls_percentiles['p2'].append(float(row[6]))     # Girls cent2
                    girls_percentiles['p9'].append(float(row[7]))     # Girls cent9
                    girls_percentiles['p25'].append(float(row[8]))    # Girls cent25
                    girls_percentiles['p50'].append(float(row[9]))    # Girls cent50
                    girls_percentiles['p75'].append(float(row[10]))   # Girls cent75
                    girls_percentiles['p91'].append(float(row[11]))   # Girls cent91
                    girls_percentiles['p98'].append(float(row[12]))   # Girls cent98
                    girls_percentiles['p99_6'].append(float(row[13])) # Girls cent99.6
                    
                    # Boys data: columns 17-25
                    boys_ages.append(age_months)
                    boys_percentiles['p0_4'].append(float(row[17]))   # Boys cent0.4
                    boys_percentiles['p2'].append(float(row[18]))     # Boys cent2
                    boys_percentiles['p9'].append(float(row[19]))     # Boys cent9
                    boys_percentiles['p25'].append(float(row[20]))    # Boys cent25
                    boys_percentiles['p50'].append(float(row[21]))    # Boys cent50
                    boys_percentiles['p75'].append(float(row[22]))    # Boys cent75
                    boys_percentiles['p91'].append(float(row[23]))    # Boys cent91
                    boys_percentiles['p98'].append(float(row[24]))    # Boys cent98
                    boys_percentiles['p99_6'].append(float(row[25]))  # Boys cent99.6
                    
                except (ValueError, IndexError):
                    # Skip rows with invalid data
                    continue
                    
    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_file_path}")
        return None
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return None
    
    # Return data in the new nested structure format
    return {
        'boy': {
            'ages': boys_ages,
            'percentiles': boys_percentiles
        },
        'girl': {
            'ages': girls_ages,
            'percentiles': girls_percentiles
        }
    }


def save_data_file(data, output_path='data/hk2020-growth-data.json'):
    """
    Save the extracted data to JSON file in the data directory.
    
    Args:
        data (dict): Growth data from extract_hk_growth_data()
        output_path (str): Output file path
        
    Returns:
        bool: True if successful, False otherwise
    """
    
    if not data:
        print("No data to save")
        return False
    
    try:
        # Ensure the data directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save to the data directory with compact format (same as current file)
        with open(output_path, 'w') as f:
            json.dump(data, f, separators=(',', ':'))
        
        print(f"✅ Data saved to '{output_path}'")
        return True
        
    except Exception as e:
        print(f"❌ Error saving data file: {e}")
        return False


def display_sample_data(data):
    """
    Display sample data for verification.
    
    Args:
        data (dict): Growth data to display
    """
    
    if not data:
        return
    
    print("\n" + "=" * 60)
    print("SAMPLE DATA VERIFICATION")
    print("=" * 60)
    
    for gender in ['boy', 'girl']:
        gender_data = data[gender]
        total_points = len(gender_data['ages'])
        age_range_months = (min(gender_data['ages']), max(gender_data['ages']))
        age_range_years = (age_range_months[0] / 12, age_range_months[1] / 12)
        
        print(f"\n{gender.title()}s:")
        print(f"  • Data points: {total_points}")
        print(f"  • Age range: {age_range_months[0]} to {age_range_months[1]} months ({age_range_years[0]:.1f} to {age_range_years[1]:.1f} years)")
        print(f"  • 50th percentile at 18 years: {gender_data['percentiles']['p50'][-1]} cm")
        
        # Show first few data points
        print(f"  • First 3 ages: {gender_data['ages'][:3]} months")
        print(f"  • First 3 heights (50th percentile): {gender_data['percentiles']['p50'][:3]} cm")


def main():
    """Main function to extract and save Hong Kong growth data."""
    
    print("🇭🇰 Hong Kong 2020 Growth Chart Data Extractor")
    print("=" * 60)
    print("Generating data for the new application architecture...")
    print()
    
    # Extract data from CSV
    print("📊 Extracting data from CSV file...")
    data = extract_hk_growth_data()
    
    if not data:
        print("❌ Failed to extract data. Please check the CSV file path and format.")
        return
    
    print("✅ Data extraction successful!")
    
    # Display sample data for verification
    display_sample_data(data)
    
    # Save to the new location
    print(f"\n💾 Saving data to application directory...")
    success = save_data_file(data)
    
    if success:
        print(f"\n🎉 SUCCESS! Hong Kong 2020 growth data has been updated.")
        print(f"   The application will now use the latest data from the CSV source.")
        print(f"\n📁 File structure:")
        print(f"   data/hk2020-growth-data.json ← Updated with fresh data")
        print(f"   data/who-cdc-growth-data.json ← Unchanged")
    else:
        print(f"\n❌ Failed to save data. Please check file permissions.")
    
    print(f"\n📋 Data Summary:")
    print(f"   • Hong Kong 2020 Growth Survey 2020-22")
    print(f"   • Chinese University of Hong Kong & University of Hong Kong")
    print(f"   • 9 percentiles: 0.4th, 2nd, 9th, 25th, 50th, 75th, 91st, 98th, 99.6th")
    print(f"   • Age range: 0-18 years (87 data points)")


if __name__ == "__main__":
    main() 