#!/bin/bash
set -e

PROJECT_ROOT="/home/ubuntu/wedding-invites"
FRONTEND_DIST="$PROJECT_ROOT/dist"
NGINX_WWW="/var/www/wedding/frontend"

echo "--- Starting Deployment ---"

cd $PROJECT_ROOT
git checkout -- .
git pull origin main

echo "Building Frontend..."
export NODE_OPTIONS="--max-old-space-size=1536"
npm install
npm run build

echo "Updating Frontend files..."
sudo mkdir -p $NGINX_WWW
sudo rm -rf $NGINX_WWW/*
sudo cp -r $FRONTEND_DIST/* $NGINX_WWW/
sudo chown -R www-data:www-data $NGINX_WWW

echo "Updating Backend..."
cd $PROJECT_ROOT/api
export PATH="$HOME/.local/bin:$PATH"

if ! command -v uv &> /dev/null
then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

uv sync --frozen --no-dev

echo "Restarting Services..."
sudo systemctl daemon-reload
sudo systemctl restart wedding-api
sudo systemctl restart nginx

echo "--- Deployment Complete! ---"
echo "Visit http://63.181.129.255"
