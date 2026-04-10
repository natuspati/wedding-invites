#!/bin/bash
set -e

# Configuration
PROJECT_ROOT="/home/ubuntu/wedding-invites"
FRONTEND_DIST="$PROJECT_ROOT/dist"
NGINX_WWW="/var/www/wedding/frontend"

echo "--- Starting Deployment ---"

# 1. Pull latest code
cd $PROJECT_ROOT
# Reset any local changes/case-sensitivity issues
git checkout -- .
git pull origin main

# 2. Build Frontend
echo "Building Frontend..."
# Ensure we use enough memory for the build and handle Vite build overhead
export NODE_OPTIONS="--max-old-space-size=1536"
npm install
npm run build

# 3. Move Frontend files to Nginx directory
echo "Updating Frontend files..."
sudo mkdir -p $NGINX_WWW
sudo rm -rf $NGINX_WWW/*
sudo cp -r $FRONTEND_DIST/* $NGINX_WWW/
sudo chown -R www-data:www-data $NGINX_WWW

# 4. Update Backend
echo "Updating Backend..."
cd $PROJECT_ROOT/api
if ! command -v uv &> /dev/null
then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    source $HOME/.cargo/env
fi

uv sync --frozen --no-dev

# 5. Restart Services
echo "Restarting Services..."
sudo systemctl daemon-reload
sudo systemctl restart wedding-api
sudo systemctl restart nginx

echo "--- Deployment Complete! ---"
echo "Visit http://63.181.129.255"
