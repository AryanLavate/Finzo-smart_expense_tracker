#!/usr/bin/env python3
"""
Project launcher for Finzo.

Default behavior starts backend and frontend together if npm is available.
If npm is missing, it falls back to backend-only mode.
"""

from __future__ import annotations

import argparse
import os
import shutil
import signal
import subprocess
import sys
import time
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"


def resolve_npm_command() -> str | None:
    if os.name == "nt":
        local_npm = ROOT_DIR / "npm.cmd"
        if local_npm.exists():
            return str(local_npm.resolve())

        npm_cmd = shutil.which("npm.cmd") or shutil.which("npm")
        if npm_cmd:
            return str(Path(npm_cmd).resolve())
        return None

    npm_cmd = shutil.which("npm")
    if npm_cmd:
        return str(Path(npm_cmd).resolve())
    return None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Finzo services")
    parser.add_argument("--host", default="127.0.0.1", help="Backend host")
    parser.add_argument("--port", type=int, default=8000, help="Backend port")
    parser.add_argument(
        "--backend-only",
        action="store_true",
        help="Run only backend API and skip frontend startup",
    )
    return parser.parse_args()


def start_frontend() -> subprocess.Popen[str]:
    npm_cmd = resolve_npm_command()
    if not npm_cmd:
        raise RuntimeError("npm not found. Install Node.js to run the frontend.")
    if not FRONTEND_DIR.exists():
        raise RuntimeError("frontend directory not found.")

    creationflags = 0
    if os.name == "nt":
        # Start a dedicated process group so CTRL_BREAK_EVENT reaches npm/vite.
        creationflags = subprocess.CREATE_NEW_PROCESS_GROUP

    process = subprocess.Popen(
        [npm_cmd, "run", "frontend"],
        cwd=str(FRONTEND_DIR),
        text=True,
        creationflags=creationflags,
    )
    time.sleep(2)
    if process.poll() is not None:
        raise RuntimeError(
            f"frontend process exited early with code {process.returncode}"
        )
    return process


def run_backend(host: str, port: int) -> None:
    # Ensure backend package imports resolve when started from repo root.
    sys.path.insert(0, str(BACKEND_DIR))
    os.chdir(BACKEND_DIR)

    import uvicorn

    uvicorn.run("main:app", host=host, port=port, reload=False)


def stop_frontend_process(process: subprocess.Popen[str]) -> None:
    if process.poll() is not None:
        return

    process.send_signal(signal.CTRL_BREAK_EVENT if os.name == "nt" else signal.SIGTERM)
    try:
        process.wait(timeout=5)
        return
    except subprocess.TimeoutExpired:
        process.terminate()

    try:
        process.wait(timeout=3)
        return
    except subprocess.TimeoutExpired:
        if os.name == "nt":
            # Ensure child process tree is removed (npm.cmd -> node/vite).
            subprocess.run(
                ["taskkill", "/PID", str(process.pid), "/T", "/F"],
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        else:
            process.kill()


def main() -> int:
    args = parse_args()
    frontend_proc: subprocess.Popen[str] | None = None

    if not args.backend_only:
        try:
            frontend_proc = start_frontend()
            # Small delay helps surface immediate startup errors.
            time.sleep(1)
        except Exception as exc:
            print(f"Frontend not started: {exc}", flush=True)
            print("Continuing with backend only.", flush=True)

    try:
        run_backend(args.host, args.port)
    except KeyboardInterrupt:
        pass
    except Exception as exc:
        print(f"Backend failed to start: {exc}", flush=True)
        return 1
    finally:
        if frontend_proc and frontend_proc.poll() is None:
            stop_frontend_process(frontend_proc)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
