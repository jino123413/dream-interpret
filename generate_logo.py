"""
Generate dream-interpret (꿈 뭐래) app logo.
Concept: Crystal ball / dream nebula / mystical orb.
- Deep indigo background (#1A1B4B)
- Lavender/purple crystal ball with nebula swirls inside
- Minimal flat style, premium, no text
Output: 600x600 PNG (generated at 512x512, resized)
"""
import urllib.request
import json
import time
import os
import shutil
from pathlib import Path

COMFYUI_URL = "http://127.0.0.1:8188"
OUTPUT_DIR = Path(r"C:\Users\USER-PC\Desktop\appintoss-project\dream-interpret\public")
APP_LOGOS_DIR = Path(r"C:\Users\USER-PC\Desktop\appintoss-project\app-logos")
COMFYUI_OUTPUT = Path(
    r"C:\Users\USER-PC\Downloads\ComfyUI_windows_portable_nvidia"
    r"\ComfyUI_windows_portable\ComfyUI\output"
)

LOGO_PROMPTS = [
    {
        "name": "dream_logo_v1",
        "seed": 80101,
        "clip_l": (
            "app icon, glowing crystal ball on deep indigo background, "
            "purple lavender nebula swirls inside the orb, mystical, "
            "minimal flat illustration, centered, no text"
        ),
        "t5xxl": (
            "a premium mobile app icon on solid deep indigo background hex 1A1B4B, "
            "a beautiful glowing crystal ball floating in the center, "
            "the crystal ball is translucent with swirling nebula clouds inside, "
            "colors inside the ball are lavender hex C4B5FD and soft purple hex 8B5CF6, "
            "with tiny star-like sparkles floating within the orb, "
            "the ball emits a soft ethereal glow in lavender hex C4B5FD around it, "
            "the overall mood is mystical dreamy and magical like a dream world, "
            "flat minimal vector illustration style, clean bold shapes, "
            "premium luxury brand feel, soft glow effect around the orb, "
            "perfectly centered in the square icon, no text no letters no words"
        ),
    },
    {
        "name": "dream_logo_v2",
        "seed": 80202,
        "clip_l": (
            "app icon, purple crystal orb with stars inside, deep navy background, "
            "dreamy mystical atmosphere, soft glow, minimal flat art, no text"
        ),
        "t5xxl": (
            "a square app icon with solid dark indigo background hex 1A1B4B, "
            "featuring a single luminous crystal sphere at the center, "
            "the sphere contains swirling cosmic nebula in purple and lavender tones, "
            "inside the orb there are tiny twinkling stars and cloud-like formations, "
            "the glass sphere has a subtle reflection highlight on the upper left, "
            "a soft radial glow extends from the orb in pale lavender hex C4B5FD, "
            "small sparkle particles float around the sphere, "
            "the feeling is like looking into a dream world captured in a glass ball, "
            "flat minimal design, clean vector shapes, premium app icon quality, "
            "no gradients on the background only on the orb itself, "
            "no text no typography no letters, perfectly centered"
        ),
    },
    {
        "name": "dream_logo_v3",
        "seed": 80303,
        "clip_l": (
            "app icon, mystical dream orb, cloud nebula inside glass sphere, "
            "deep indigo background, lavender purple glow, "
            "premium flat illustration, centered, no text"
        ),
        "t5xxl": (
            "a minimalist yet magical app icon, solid deep indigo background hex 1A1B4B, "
            "a perfectly round crystal ball in the center glowing with inner light, "
            "inside the crystal ball soft purple clouds and nebula formations swirl gently, "
            "colors are lavender hex C4B5FD, soft violet hex 8B5CF6, and white wisps, "
            "three or four tiny star dots twinkle inside the orb, "
            "the orb sits on nothing floating in space, "
            "a crescent moon shape in pale gold hex FDE68A subtly visible behind the orb, "
            "the glow around the sphere is soft and dreamlike, "
            "this represents a dream interpretation magical crystal ball, "
            "flat clean vector art style, bold simple shapes, "
            "designed to look magical and premium at any size, "
            "no text no words, solid color background, square format"
        ),
    },
    {
        "name": "dream_logo_v4",
        "seed": 80404,
        "clip_l": (
            "app icon, crystal ball dream catcher, nebula and stars inside orb, "
            "indigo night sky background, soft purple glow, flat design, no text"
        ),
        "t5xxl": (
            "a premium brand app icon, solid dark indigo night background hex 1A1B4B, "
            "a central luminous crystal sphere that captures dreams, "
            "the orb is filled with a beautiful miniature galaxy of purple nebula clouds, "
            "delicate wisps of lavender hex C4B5FD and violet hex 7C3AED swirl inside, "
            "pinpoint stars of white and gold dot the interior like captured starlight, "
            "the sphere surface has a clean glass-like quality with a single highlight, "
            "emanating from the orb is a soft halo of pale purple light, "
            "the whole composition evokes mystery and the world of dreams, "
            "flat illustration style with clean precise vector shapes, "
            "luxury premium app branding quality, "
            "looks beautiful and recognizable at sizes from 512px to 48px, "
            "no text no letters, perfectly centered in square format"
        ),
    },
]


def build_txt2img_workflow(prompt_data):
    prefix = prompt_data["name"]
    return {
        "prompt": {
            "1": {
                "class_type": "UnetLoaderGGUF",
                "inputs": {"unet_name": "flux1-schnell-Q4_K_S.gguf"},
            },
            "2": {
                "class_type": "DualCLIPLoaderGGUF",
                "inputs": {
                    "clip_name1": "clip_l.safetensors",
                    "clip_name2": "t5-v1_1-xxl-encoder-Q4_K_M.gguf",
                    "type": "flux",
                },
            },
            "3": {
                "class_type": "CLIPTextEncodeFlux",
                "inputs": {
                    "clip": ["2", 0],
                    "clip_l": prompt_data["clip_l"],
                    "t5xxl": prompt_data["t5xxl"],
                    "guidance": 3.5,
                },
            },
            "4": {
                "class_type": "CLIPTextEncodeFlux",
                "inputs": {
                    "clip": ["2", 0],
                    "clip_l": "",
                    "t5xxl": "",
                    "guidance": 3.5,
                },
            },
            "5": {
                "class_type": "EmptySD3LatentImage",
                "inputs": {
                    "width": 512,
                    "height": 512,
                    "batch_size": 1,
                },
            },
            "6": {
                "class_type": "KSampler",
                "inputs": {
                    "model": ["1", 0],
                    "seed": prompt_data["seed"],
                    "steps": 4,
                    "cfg": 1.0,
                    "sampler_name": "euler",
                    "scheduler": "simple",
                    "positive": ["3", 0],
                    "negative": ["4", 0],
                    "latent_image": ["5", 0],
                    "denoise": 1.0,
                },
            },
            "7": {
                "class_type": "VAELoader",
                "inputs": {"vae_name": "ae.safetensors"},
            },
            "8": {
                "class_type": "VAEDecode",
                "inputs": {"samples": ["6", 0], "vae": ["7", 0]},
            },
            "9": {
                "class_type": "SaveImage",
                "inputs": {"images": ["8", 0], "filename_prefix": prefix},
            },
        }
    }


def queue_prompt(workflow):
    data = json.dumps(workflow).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    return json.loads(urllib.request.urlopen(req).read())["prompt_id"]


def wait_for_completion(prompt_id, timeout=600):
    start = time.time()
    while time.time() - start < timeout:
        try:
            resp = urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}")
            history = json.loads(resp.read())
            if prompt_id in history:
                status = history[prompt_id].get("status", {})
                if status.get("completed", False) or status.get("status_str") == "success":
                    return history[prompt_id]
                if status.get("status_str") == "error":
                    print(f"  ERROR: {json.dumps(status, indent=2)[:500]}")
                    return None
        except Exception:
            pass
        time.sleep(3)
    print("  TIMEOUT")
    return None


def find_output_file(history):
    try:
        for nid, nout in history.get("outputs", {}).items():
            if "images" in nout:
                return nout["images"][0].get("filename", "")
    except Exception:
        pass
    return ""


def resize_image(src, dst, w, h):
    try:
        from PIL import Image
        img = Image.open(src)
        img = img.resize((w, h), Image.LANCZOS)
        img.save(dst, "PNG", optimize=True)
        return True
    except ImportError:
        shutil.copy2(src, dst)
        return False


def generate_batch(prompts, label):
    print(f"\n{'='*50}")
    print(f"Generating {len(prompts)} {label} variants...")
    print(f"{'='*50}")

    for p in prompts:
        print(f"\n[{p['name']}] seed={p['seed']}")
        workflow = build_txt2img_workflow(p)
        try:
            prompt_id = queue_prompt(workflow)
            print(f"  Queued: {prompt_id}")
        except Exception as e:
            print(f"  FAILED to queue: {e}")
            continue

        history = wait_for_completion(prompt_id, timeout=300)
        if not history:
            print("  Failed or timed out")
            continue

        filename = find_output_file(history)
        if not filename:
            print("  No output file found")
            continue

        src_path = COMFYUI_OUTPUT / filename
        if not src_path.exists():
            for subdir in COMFYUI_OUTPUT.iterdir():
                if subdir.is_dir() and (subdir / filename).exists():
                    src_path = subdir / filename
                    break

        if src_path.exists():
            # Save to public/ for dev
            dst_path = OUTPUT_DIR / f"dream-interpret-{p['name']}.png"
            resized = resize_image(str(src_path), str(dst_path), 600, 600)
            size_kb = os.path.getsize(str(dst_path)) / 1024
            method = "resized" if resized else "copied"
            print(f"  Saved ({method}): {dst_path.name} ({size_kb:.0f}KB)")

            # Also save to app-logos/
            logo_dst = APP_LOGOS_DIR / f"dream-interpret-{p['name']}.png"
            resize_image(str(src_path), str(logo_dst), 600, 600)
            print(f"  Also saved to: {logo_dst}")
        else:
            print(f"  Output not found: {src_path}")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(APP_LOGOS_DIR, exist_ok=True)

    print("=" * 50)
    print("  dream-interpret (꿈 뭐래) Logo Generator")
    print("  Concept: Crystal Ball with Dream Nebula")
    print("  Background: Deep Indigo #1A1B4B")
    print("  Accent: Lavender #C4B5FD")
    print("  Style: Minimal flat, premium, no text")
    print("=" * 50)

    generate_batch(LOGO_PROMPTS, "logo")

    print(f"\n{'='*50}")
    print("All done! Check outputs in:")
    print(f"  {OUTPUT_DIR}")
    print(f"  {APP_LOGOS_DIR}")
    print("\nPick the best one and rename to:")
    print(f"  {APP_LOGOS_DIR / 'dream-interpret.png'}")
    print("=" * 50)


if __name__ == "__main__":
    main()
