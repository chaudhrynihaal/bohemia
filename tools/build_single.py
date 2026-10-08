"""
Build self-contained single-file versions of the Bohemia prototype
(for sharing / uploading to design tools such as Claude Design).

    python tools/build_single.py

Output: dist/bohemia-home.html and dist/bohemia-residence.html
Everything (CSS, JS, libraries, images, a short film clip) is embedded.
Images are recompressed for size; the film becomes a short silent clip; the
plan PDFs and the music score are left out. Links between the two pages
won't work inside tools that take a single file.

Requires: Pillow, ffmpeg on PATH, internet (first run, to fetch GSAP/Lenis).
"""
import base64, io, json, os, re, subprocess, sys, tempfile, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
CACHE = ROOT / 'tools' / '.cache'
LIBS = {
    'gsap': 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
    'st': 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
    'lenis': 'https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js',
}


def lib(name):
    CACHE.mkdir(parents=True, exist_ok=True)
    f = CACHE / (name + '.js')
    if not f.exists():
        f.write_bytes(urllib.request.urlopen(LIBS[name]).read())
    return f.read_text(encoding='utf-8')


def webp(path, max_side, q, keep_alpha=False):
    im = Image.open(path)
    im = im.convert('RGBA' if keep_alpha else 'RGB')
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=q, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()


def jpeg(path, max_side, q):
    im = Image.open(path).convert('RGB'); im.thumbnail((max_side, max_side), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


def film_clip():
    out = Path(tempfile.gettempdir()) / 'bohemia_clip.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '0', '-i', str(ROOT / 'assets/film/hero-1080.mp4'), '-t', '12',
                    '-an', '-vf', 'scale=960:-2,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '31',
                    '-movflags', '+faststart', str(out)], check=True)
    return 'data:video/mp4;base64,' + base64.b64encode(out.read_bytes()).decode()


def build_assets():
    A = {}      # path -> data URI
    shared = [] # big repeated payloads referenced by index
    a = ROOT / 'assets'
    for f in sorted((a / 'img').glob('*.webp')):
        small = f.stem.endswith('-sm')
        A['assets/img/' + f.name] = webp(f, 900 if small else 1600, 68 if small else 70)
    for f in sorted((a / 'mat').glob('*.webp')):
        A['assets/mat/' + f.name] = webp(f, 700, 74)
    for f in sorted((a / 'plans').glob('*.webp')):
        A['assets/plans/' + f.name] = webp(f, 1800, 80, keep_alpha=True)
    # dusk: every second frame at 1280px; odd frames reuse their neighbour
    frames = sorted((a / 'dusk').glob('f*.webp'))
    idx = {}
    for i, f in enumerate(frames):
        if i % 2 == 0 or i == len(frames) - 1:
            idx[i] = len(shared); shared.append(webp(f, 1280, 62))
        else:
            idx[i] = None
    for i, f in enumerate(frames):
        j = idx[i] if idx[i] is not None else idx[i - 1]
        A['assets/dusk/' + f.name] = ('@', j)
    # masks follow the same frame sharing, so each frame keeps its matching cut-out —
    # only needed while the hero lettering effect is switched on in home.js
    hero_word = 'const HERO_WORD = true' in (ROOT / 'js/home.js').read_text(encoding='utf-8')
    midx = {}
    for i, f in (enumerate(frames) if hero_word else []):
        src = i if idx[i] is not None else i - 1
        if src not in midx:
            midx[src] = len(shared); shared.append(webp(a / 'dusk-mask' / f'f{src:03d}.webp', 1280, 80, keep_alpha=True))
        A['assets/dusk-mask/' + f.name] = ('@', midx[src])
    clip = film_clip()
    ci = len(shared); shared.append(clip)  # stored once, referenced three times (full film too large to embed)
    for k in ('hero-1080.mp4', 'hero-720.mp4', 'bohemia-film.mp4'):
        A['assets/film/' + k] = ('@', ci)
    A['assets/film/hero-poster.jpg'] = jpeg(a / 'film/hero-poster.jpg', 1280, 70)
    return A, shared


def asset_script(A, shared):
    lines = ['window.__ASSETS={};(function(S,A){']
    lines.append('var D=' + json.dumps(shared) + ';')
    plain = {k: v for k, v in A.items() if not isinstance(v, tuple)}
    lines.append('var P=' + json.dumps(plain) + ';for(var k in P)A[k]=P[k];')
    refs = {k: v[1] for k, v in A.items() if isinstance(v, tuple)}
    lines.append('var R=' + json.dumps(refs) + ';for(var k in R)A[k]=D[R[k]];')
    lines.append('})(0,window.__ASSETS);')
    return '\n'.join(lines)


def inline(page, scripts, A, asset_js):
    html = (ROOT / page).read_text(encoding='utf-8')
    css = (ROOT / 'css/style.css').read_text(encoding='utf-8')
    css = css.replace("url('../assets/img/travertine.webp')", "url('" + A['assets/img/travertine.webp'] + "')")
    css += '\n/* single-file build */\n.sound{display:none!important}\n.plan__pdf{display:none!important}\n'
    html = re.sub(r'<link rel="stylesheet" href="css/style\.css[^"]*">', lambda m: '<style>\n' + css + '\n</style>', html)
    html = re.sub(r'\s*<link rel="preload"[^>]*>', '', html)
    html = re.sub(r'<source media=[^>]*>', '', html)
    html = re.sub(r'\s*<meta property="og:image"[^>]*>', '', html)
    html = re.sub(r'\s*<audio [^>]*></audio>', '', html)
    # static asset references in the markup
    for path, uri in A.items():
        if isinstance(uri, str):
            html = html.replace('"' + path + '"', '"' + uri + '"')
    # scripts: CDN libraries + project scripts, in order
    html = re.sub(r'\s*<script src="https://cdn\.jsdelivr\.net[^"]+"></script>', '', html)
    html = re.sub(r'\s*<script src="js/[^"]+"></script>', '', html)
    body = ['<script>' + lib('gsap') + '</script>', '<script>' + lib('st') + '</script>', '<script>' + lib('lenis') + '</script>',
            '<script>' + asset_js + '</script>']
    for s in scripts:
        body.append('<script>\n' + (ROOT / 'js' / s).read_text(encoding='utf-8') + '\n</script>')
    html = html.replace('</body>', '\n'.join(body) + '\n</body>')
    return html


def main():
    DIST.mkdir(exist_ok=True)
    print('Compressing assets…')
    A, shared = build_assets()
    home = lambda k: not k.startswith('assets/plans/') and not k.endswith('-sm.webp')
    res = lambda k: not k.startswith(('assets/dusk/', 'assets/dusk-mask/', 'assets/film/', 'assets/mat/'))
    for page, scripts, out, keep in [('index.html', ['data.js', 'sky.js', 'main.js', 'home.js'], 'bohemia-home.html', home),
                                     ('residence.html', ['data.js', 'main.js', 'residence.js'], 'bohemia-residence.html', res)]:
        Ap = {k: v for k, v in A.items() if keep(k)}
        html = inline(page, scripts, Ap, asset_script(Ap, shared if keep('assets/dusk/x') else []))
        (DIST / out).write_text(html, encoding='utf-8')
        print(f'{out}: {len(html.encode()) / 1048576:.1f} MB')


if __name__ == '__main__':
    main()
