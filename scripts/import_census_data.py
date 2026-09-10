import json
import re

with open('src/lib/data/states_and_ut.json', encoding='utf-8') as f:
    census_data = json.load(f)

ut_map = {
    'ANDAMAN_NICOBAR': 'Andaman and Nicobar Islands',
    'CHANDIGARH': 'Chandigarh',
    'DNH_DD': 'Dadra and Nagar Haveli and Daman and Diu',
    'DELHI': 'Delhi',
    'JAMMU_KASHMIR': 'Jammu and Kashmir',
    'LADAKH': 'Ladakh',
    'LAKSHADWEEP': 'Lakshadweep',
    'PUDUCHERRY': 'Puducherry'
}

with open('src/js/data/territories.js', encoding='utf-8') as f:
    content = f.read()

for code, name in ut_map.items():
    rec = next((r for r in census_data if r['name'] == name), None)
    if not rec:
        print(f"Not found: {name}")
        continue
    
    pattern = re.compile(rf'(id:\s*\"{code}\",[\s\S]*?advisories:\s*\[[\s\S]*?\])([\s\n]*\}})', re.MULTILINE)
    
    langs = json.dumps(rec['officialLanguages'])
    extra_fields = f''',
    isoCode: "{rec['isoCode']}",
    vehicleCode: "{rec['vehicleCode']}",
    zone: "{rec['zone']}",
    areaKm2: {rec['areaKm2']},
    population2011: {rec['population2011']},
    officialLanguages: {langs},
    largestCity: "{rec['largestCity']}"'''
    
    def repl(m, extra=extra_fields):
        return m.group(1) + extra + m.group(2)
        
    content = pattern.sub(repl, content, count=1)

with open('src/js/data/territories.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated src/js/data/territories.js with census fields!')
