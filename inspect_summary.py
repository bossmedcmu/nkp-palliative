import json

with open('extracted_sheets.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for name, rows in data.items():
    print(f"==================================================")
    print(f"Sheet: {name} (total {len(rows)} non-empty rows)")
    for r in rows[:4]:
        print(f"  Row {r['row']}:")
        for col, val in list(r['cells'].items())[:15]:
            print(f"    {col}: {str(val)[:80]}")
