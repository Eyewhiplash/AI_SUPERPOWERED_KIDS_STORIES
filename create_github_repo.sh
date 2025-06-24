#!/bin/bash

# Läs GitHub token från .env
source .env

# Skapa repository via GitHub API
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{
    "name": "ai-storyteller-kids",
    "description": "� AI-powered storytelling app for children - Creating magical stories with safety and fun!",
    "private": false,
    "has_wiki": false,
    "has_projects": false,
    "has_issues": true
  }'

echo "Repository created! Now adding remote and pushing..."

# Lägg till remote och pusha
git remote add origin git@github.com:$(git config user.name)/ai-storyteller-kids.git
git branch -M main
git push -u origin main

echo "� Done! Repository created and code pushed!"
