import json, os, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / 'catalog.json'
JS = ROOT / 'js' / 'gallery.js'
PREFIX = {'Star Wars': 'SW', 'Warhammer 40,000': 'WH'}

with CATALOG.open('r', encoding='utf-8') as f:
    data = json.load(f)
items = data.get('miniatures', [])
if not items:
    raise SystemExit('catalog.json contains no miniatures')

# Safety: this migration is intended to run once.
if all(re.fullmatch(r'[A-Z]{2}-\d{4}', str(m.get('id',''))) for m in items):
    print('Catalogue IDs already migrated; nothing to do.')
    sys.exit(0)

moves = {}
for n, m in enumerate(items, 1):
    universe = m.get('universe')
    if universe not in PREFIX:
        raise SystemExit(f'Unknown universe at catalogue item {n}: {universe!r}')
    new_id = f"{PREFIX[universe]}-{n:04d}"
    m['id'] = new_id
    for im in m.get('images', []):
        for key in ('url', 'thumbnail', 'thumb', 'full'):
            old = im.get(key)
            if not old or not old.startswith('images/'):
                continue
            p = Path(old)
            if p.name.startswith(new_id + '-'):
                continue
            new = str(p.with_name(new_id + '-' + p.name)).replace('\\', '/')
            previous = moves.get(old)
            if previous and previous != new:
                raise SystemExit(f'Conflicting rename for {old}: {previous} vs {new}')
            moves[old] = new
            im[key] = new

data['lastCatalogNumber'] = len(items)

# Validate every source and destination before changing anything.
for old, new in moves.items():
    src, dst = ROOT / old, ROOT / new
    if not src.is_file():
        raise SystemExit(f'Missing source image: {old}')
    if dst.exists() and dst.resolve() != src.resolve():
        raise SystemExit(f'Destination already exists: {new}')

# Rename without changing image bytes.
for old, new in moves.items():
    dst = ROOT / new
    dst.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['git', 'mv', '--', old, new], cwd=ROOT, check=True)

with CATALOG.open('w', encoding='utf-8', newline='\n') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

# Show the new ID only inside the detail viewer. Cards/filters remain unchanged.
js = JS.read_text(encoding='utf-8')
old_line = "$('#viewer-path').textContent=[m.universe,m.faction,m.subfaction,brandOf(m)].filter(Boolean).join(' / ');"
new_line = "$('#viewer-path').textContent=[`ID: ${m.id}`,m.universe,m.faction,m.subfaction,brandOf(m)].filter(Boolean).join(' / ');"
if old_line in js:
    js = js.replace(old_line, new_line, 1)
elif new_line not in js:
    raise SystemExit('Could not locate viewer-path assignment in js/gallery.js')
JS.write_text(js, encoding='utf-8', newline='\n')

# Final integrity checks.
ids = [m['id'] for m in items]
if len(ids) != len(set(ids)):
    raise SystemExit('Duplicate catalogue IDs after migration')
for m in items:
    for im in m.get('images', []):
        for key in ('url', 'thumbnail', 'thumb', 'full'):
            p = im.get(key)
            if p and p.startswith('images/') and not (ROOT / p).is_file():
                raise SystemExit(f'Broken catalogue image reference after migration: {p}')

print(f'Migrated {len(items)} catalogue records and renamed {len(moves)} unique image files.')
print(f'Last catalogue number: {len(items)}')
