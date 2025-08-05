#!/bin/bash

# Perform git add .
git add .

# Display git status
git status

# Prompt the user to continue
read -p "Still want to push ? (y/n): " choice
if [ "$choice" != "y" ]; then
    echo "Aborted."
    exit 0
fi

# Check if no commit message is provided
if [ -z "$1" ]; then
    echo "No commit message provided."
    echo "Usage: ./git_push.sh 'Commit message'"
    exit 1
fi

# Concatenate all arguments into a single commit message
commit_message="$*"

# Perform git commit with the provided message
git commit -m "$commit_message"

# Perform git push
git push