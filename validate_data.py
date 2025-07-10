#!/usr/bin/env python3
import json

# Load and validate the generated data
with open('data/hk2020-growth-data.json') as f:
    data = json.load(f)

print('✅ Data Structure Validation:')
print(f"   • Boys ages: {len(data['boy']['ages'])} data points")
print(f"   • Girls ages: {len(data['girl']['ages'])} data points")
print(f"   • Boys percentiles: {len(data['boy']['percentiles'])} categories")
print(f"   • Girls percentiles: {len(data['girl']['percentiles'])} categories")

# Check a few key values
print(f"\n✅ Sample Values:")
print(f"   • Boys 18yrs (216m) 50th percentile: {data['boy']['percentiles']['p50'][-1]} cm")
print(f"   • Girls 18yrs (216m) 50th percentile: {data['girl']['percentiles']['p50'][-1]} cm")

# Check structure matches expected format
expected_percentiles = ['p0_4', 'p2', 'p9', 'p25', 'p50', 'p75', 'p91', 'p98', 'p99_6']
boys_percentiles = list(data['boy']['percentiles'].keys())
girls_percentiles = list(data['girl']['percentiles'].keys())

if boys_percentiles == expected_percentiles and girls_percentiles == expected_percentiles:
    print(f"\n✅ Structure: Perfect match for application format!")
else:
    print(f"\n❌ Structure: Mismatch detected")
    print(f"   Expected: {expected_percentiles}")
    print(f"   Boys: {boys_percentiles}")
    print(f"   Girls: {girls_percentiles}")

print(f"\n🎉 Data validation complete!") 