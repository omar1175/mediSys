#!/usr/bin/env python3
"""
Startup script for MediSys project.
Starts Redis, Django backend, and frontend dev server.
"""

import subprocess
import sys
import os

def run_command(cmd, cwd=None):
    """Run a shell command."""
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd)
    return result.returncode

def main():
    project_root = "/home/omar/ITI/Django/Project"
    backend_dir = os.path.join(project_root, "backend")
    frontend_dir = os.path.join(project_root, "frontend")
    
    print("=" * 60)
    print("MediSys - Medical Appointment System")
    print("=" * 60)
    
    # 1. Start Redis
    print("\n[1/3] Starting Redis...")
    run_command("redis-server --daemonize yes", cwd=project_root)
    
    # 2. Run migrations
    print("\n[2/3] Running migrations...")
    run_command("python3 manage.py migrate", cwd=backend_dir)
    
    # 3. Start backend (Daphne for ASGI/WebSockets)
    print("\n[3/3] Starting backend server on http://localhost:8000")
    print("       (Press Ctrl+C to stop)")
    print("=" * 60)
    
    os.chdir(backend_dir)
    sys.argv = ["daphne", "-p", "8000", "-b", "0.0.0.0", "config.asgi:application"]
    
    # Import and run daphne
    from daphne.cmdline import CommandLineInterface
    cmd = CommandLineInterface()
    cmd.run(sys.argv[1:])

if __name__ == "__main__":
    main()
