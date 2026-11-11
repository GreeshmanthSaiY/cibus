import os
import shutil
import base64
from PIL import Image

src_path = r'C:\Users\GS_Y\.gemini\antigravity\brain\88450ea5-417f-4e57-8b8a-5b71fb45f24c\.user_uploaded\media_1794379472277_894a81d2.png'
dest_img_dir = os.path.join('public', 'assets', 'images')
os.makedirs(dest_img_dir, exist_ok=True)

# 1. Copy exact master logo
master_dest = os.path.join(dest_img_dir, 'cibus-logo.png')
shutil.copyfile(src_path, master_dest)
print('Master logo copied to:', master_dest)

# Load master image
im = Image.open(master_dest)
bbox = im.getbbox()
print('Artwork bbox:', bbox)

# 2. Header derivative (tight crop, high res)
cropped = im.crop(bbox)
header_dest = os.path.join(dest_img_dir, 'cibus-logo-header.png')
cropped.save(header_dest, 'PNG', optimize=True)
print('Header logo saved to:', header_dest)

# 3. Square canvas for favicon / icons
w = bbox[2] - bbox[0]
h = bbox[3] - bbox[1]
dim = int(max(w, h) * 1.05)
square_canvas = Image.new('RGBA', (dim, dim), (0, 0, 0, 0))
paste_x = (dim - w) // 2
paste_y = (dim - h) // 2
square_canvas.paste(cropped, (paste_x, paste_y), cropped)

# Generate favicon sizes
sizes = {
    'favicon-16x16.png': (16, 16),
    'favicon-32x32.png': (32, 32),
    'favicon-48x48.png': (48, 48),
    'apple-touch-icon.png': (180, 180),
    'android-chrome-192x192.png': (192, 192),
    'android-chrome-512x512.png': (512, 512),
}

for filename, size in sizes.items():
    resized = square_canvas.resize(size, Image.Resampling.LANCZOS)
    out_path = os.path.join(dest_img_dir, filename)
    resized.save(out_path, 'PNG', optimize=True)
    print(f'Saved {filename} ({size[0]}x{size[1]})')

# Multi-resolution favicon.ico
ico_16 = square_canvas.resize((16, 16), Image.Resampling.LANCZOS)
ico_32 = square_canvas.resize((32, 32), Image.Resampling.LANCZOS)
ico_48 = square_canvas.resize((48, 48), Image.Resampling.LANCZOS)

ico_path_public = os.path.join('public', 'favicon.ico')
ico_path_root = 'favicon.ico'

ico_32.save(
    ico_path_public,
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[ico_16, ico_48]
)
shutil.copyfile(ico_path_public, ico_path_root)
print('Saved multi-resolution favicon.ico in public/ and root')

# Generate faithful SVG wrapper
with open(os.path.join(dest_img_dir, 'android-chrome-192x192.png'), 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('ascii')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="100%" height="100%">
  <image href="data:image/png;base64,{b64}" width="192" height="192" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''
with open(os.path.join('public', 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_content)
with open('favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
print('Saved faithful SVG wrappers in public/favicon.svg and root favicon.svg')

