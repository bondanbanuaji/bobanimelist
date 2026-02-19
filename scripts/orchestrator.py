#!/usr/bin/env python3
"""
Orchestrator script for bobanimelist project
Handles project automation and workflow management
"""

import sys
import subprocess
import os

def run_command(command, description):
    """Run a shell command and print the result"""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {command}")
    print(f"{'='*60}\n")
    
    result = subprocess.run(command, shell=True, capture_output=False, text=True)
    
    if result.returncode != 0:
        print(f"\n❌ Failed: {description}")
        return False
    else:
        print(f"\n✅ Success: {description}")
        return True

def main():
    """Main orchestrator workflow"""
    print("🚀 Starting Orchestrator for bobanimelist\n")
    
    # Check if we're in the right directory
    if not os.path.exists("package.json"):
        print("❌ Error: package.json not found. Are you in the project root?")
        sys.exit(1)
    
    tasks = [
        ("npm run lint", "Linting code"),
        ("npm run build", "Building project"),
    ]
    
    failed_tasks = []
    
    for command, description in tasks:
        if not run_command(command, description):
            failed_tasks.append(description)
    
    print(f"\n{'='*60}")
    print("🏁 Orchestrator Complete")
    print(f"{'='*60}\n")
    
    if failed_tasks:
        print("❌ Failed tasks:")
        for task in failed_tasks:
            print(f"  - {task}")
        sys.exit(1)
    else:
        print("✅ All tasks completed successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
