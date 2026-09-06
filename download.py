import os, re, requests

files_to_scan = [
    "./src/data/characterAvatars.ts",
    "./src/data/gameData.ts",
    "./src/data/gamesData.ts",
    "./src/data/hqData.ts",
    "./src/data/townData.ts",
    "./src/data/shopData.ts"
]

url_pattern = r'https://d64gsuwffb70l\.cloudfront\.net/[^\s"\'\)]+?\.(?:png|jpg|jpeg|webp)'

all_urls = set()
for filepath in files_to_scan:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            found = re.findall(url_pattern, content, re.IGNORECASE)
            print(f"Found {len(found)} in {filepath}")
            all_urls.update(found)
    else:
        print(f"Not found: {filepath}")

print(f"\nTotal unique: {len(all_urls)}")

os.makedirs("wordandwhisker_images", exist_ok=True)

with open("wordandwhisker_images/urls.txt", "w") as out:
    for u in sorted(all_urls):
        out.write(u.split('?')[0] + "\n")

for i, url in enumerate(sorted(all_urls), 1):
    clean = url.split('?')[0].split('"')[0].split("'")[0]
    name = clean.split("/")[-1]
    dest = f"wordandwhisker_images/{name}"
    if os.path.exists(dest):
        print(f"[{i}/{len(all_urls)}] skip {name}")
        continue
    try:
        print(f"[{i}/{len(all_urls)}] downloading {name}...")
        r = requests.get(clean, timeout=20)
        if r.status_code == 200:
            with open(dest, "wb") as f:
                f.write(r.content)
    except Exception as e:
        print(f"Error {e}")

print("\nDONE! Look in wordandwhisker_images/")
