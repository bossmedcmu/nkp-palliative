import json

with open('extracted_sheets.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

lines = []
lines.append("# Google Sheet Analysis\n")
for name, rows in data.items():
    lines.append(f"## Sheet: {name} ({len(rows)} non-empty rows)\n")
    for r in rows:
        row_idx = r['row']
        cells_str = ", ".join([f"{k}: {v}" for k, v in r['cells'].items()])
        lines.append(f"- **Row {row_idx}**: {cells_str}")
    lines.append("\n")

with open('sheet_analysis.md', 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))

print("Saved sheet_analysis.md")
