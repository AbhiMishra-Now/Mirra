import os
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

def main():
    backend_dir = Path(__file__).resolve().parent
    dist_dir = backend_dir / "dist_temp"
    zip_path = backend_dir / "lambda_function.zip"
    
    # Clean up existing temp dirs or zip
    if dist_dir.exists():
        shutil.rmtree(dist_dir, ignore_errors=True)
    if zip_path.exists():
        try:
            os.remove(zip_path)
        except Exception:
            pass
        
    os.makedirs(dist_dir, exist_ok=True)
    
    print("[INFO] Installing Linux-compatible dependencies to temporary directory...")
    # Download pre-compiled Linux wheels to guarantee compatibility with AWS Lambda Environment
    pip_cmd = [
        sys.executable, "-m", "pip", "install",
        "--platform", "manylinux2014_x86_64",
        "--only-binary=:all:",
        "-r", str(backend_dir / "requirements.txt"),
        "-t", str(dist_dir)
    ]
    try:
        subprocess.check_call(pip_cmd)
        print("[SUCCESS] Linux dependencies installed.")
    except Exception as e:
        print(f"[WARNING] Linux wheel pre-compilation failed or not supported by host pip: {e}")
        print("[INFO] Retrying standard dependency installation...")
        standard_pip = [
            sys.executable, "-m", "pip", "install",
            "-r", str(backend_dir / "requirements.txt"),
            "-t", str(dist_dir)
        ]
        try:
            subprocess.check_call(standard_pip)
            print("[SUCCESS] Standard dependencies installed.")
        except Exception as err:
            print(f"[ERROR] Dependency installation failed: {err}")
            return
        
    print("[INFO] Copying backend source files...")
    # List of files/folders to copy
    items_to_copy = ["data", "lib", "routes", "services", "lambda_handler.py", "main.py"]
    for item in items_to_copy:
        src = backend_dir / item
        dst = dist_dir / item
        if src.is_dir():
            shutil.copytree(src, dst, ignore=shutil.ignore_patterns("__pycache__", "*.pyc", ".env", "*.db"))
        elif src.is_file():
            shutil.copy2(src, dst)
            
    print("[INFO] Creating clean lambda_function.zip...")
    # Archive the contents of dist_dir
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                file_path = Path(root) / file
                # Skip any sensitive environment configuration files
                if file == ".env" or file.endswith(".db"):
                    continue
                # Determine path relative to dist_dir
                arcname = file_path.relative_to(dist_dir)
                zipf.write(file_path, arcname)
                
    # Clean up temp folder
    shutil.rmtree(dist_dir, ignore_errors=True)
    print(f"[SUCCESS] Lambda package created at {zip_path}")
    print("[INFO] You can now download this zip file directly from your workspace and upload it to AWS Lambda Console.")

if __name__ == "__main__":
    main()
