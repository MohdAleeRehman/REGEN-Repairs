#!/bin/bash

# Debug script to check server issues

echo "===== Checking Node.js and NPM versions ====="
node -v
npm -v

echo "===== Checking for .env file ====="
if [ -f ~/REGEN-Repairs/server/.env ]; then
  echo ".env file exists"
else
  echo ".env file is missing!"
fi

echo "===== Checking required dependencies ====="
cd ~/REGEN-Repairs/server
if ! npm list helmet morgan; then
  echo "Installing missing dependencies..."
  npm install --save helmet morgan
fi

echo "===== Testing server manually ====="
NODE_ENV=production node -e "try { require('./server'); console.log('Server loaded successfully without errors!'); } catch(err) { console.error('Server startup error:', err); }"

echo "===== PM2 logs analysis ====="
pm2 logs --lines 50 --nostream