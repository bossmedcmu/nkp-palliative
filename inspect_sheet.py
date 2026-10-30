import zipfile
import xml.etree.ElementTree as ET
import json
import re

def parse_xlsx(filename):
    with zipfile.ZipFile(filename, 'r') as z:
        # 1. Parse shared strings
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            # namespace
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in tree.findall('ns:si', ns):
                texts = [t.text for t in si.findall('.//ns:t', ns) if t.text]
                shared_strings.append("".join(texts))
        
        # 2. Parse workbook.xml to get sheet names and ids
        wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        sheets_info = []
        for sheet in wb_tree.findall('ns:sheets/ns:sheet', ns):
            name = sheet.attrib.get('name')
            sheet_id = sheet.attrib.get('sheetId')
            r_id = sheet.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
            sheets_info.append({'name': name, 'sheetId': sheet_id, 'rId': r_id})
        
        # 3. Parse workbook.xml.rels to map rId to target file
        rels_tree = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        r_ns = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}
        rel_map = {}
        for rel in rels_tree.findall('r:Relationship', r_ns):
            rel_map[rel.attrib.get('Id')] = rel.attrib.get('Target')
        
        results = {}
        for s in sheets_info:
            target = rel_map.get(s['rId'])
            if not target.startswith('xl/'):
                target = 'xl/' + target.lstrip('/')
            
            sheet_tree = ET.fromstring(z.read(target))
            rows_data = []
            for row in sheet_tree.findall('.//ns:row', ns):
                row_idx = row.attrib.get('r')
                row_cells = {}
                for c in row.findall('ns:c', ns):
                    cell_ref = c.attrib.get('r')
                    t = c.attrib.get('t')
                    v = c.find('ns:v', ns)
                    val = v.text if v is not None else ''
                    if t == 's' and val != '':
                        idx = int(val)
                        if idx < len(shared_strings):
                            val = shared_strings[idx]
                    elif t == 'b':
                        val = (val == '1')
                    row_cells[cell_ref] = val
                rows_data.append(row_cells)
            results[s['name']] = rows_data
            
        return results

data = parse_xlsx('sheet.xlsx')
for name, rows in data.items():
    print(f"=== Sheet: {name} ({len(rows)} rows) ===")
    for r in rows[:10]:
        print(r)
