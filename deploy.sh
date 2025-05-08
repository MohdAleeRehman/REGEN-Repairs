#!/bin/bash

# REGEN-Repairs deployment script for EC2

# Colors for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}  REGEN-Repairs Deployment Script - $(date)  ${NC}"
echo -e "${GREEN}===============================================${NC}"

# Update system packages
echo -e "\n${YELLOW}Updating system packages...${NC}"
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js and npm if not already installed
if ! command -v node &> /dev/null; then
    echo -e "\n${YELLOW}Installing Node.js and npm...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "\n${GREEN}Node.js already installed: $(node -v)${NC}"
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo -e "\n${YELLOW}Installing PM2 for process management...${NC}"
    sudo npm install pm2 -g
else
    echo -e "\n${GREEN}PM2 already installed${NC}"
fi

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo -e "\n${YELLOW}Installing Nginx for reverse proxy...${NC}"
    sudo apt-get install -y nginx
else
    echo -e "\n${GREEN}Nginx already installed${NC}"
fi

# Create Nginx configuration
echo -e "\n${YELLOW}Configuring Nginx as reverse proxy...${NC}"
sudo tee /etc/nginx/sites-available/regen-repairs <<EOF
server {
    listen 80;
    server_name repairs.regen.pk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the Nginx site configuration
sudo ln -sf /etc/nginx/sites-available/regen-repairs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo -e "\n${YELLOW}Testing Nginx configuration...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}Nginx configuration is valid${NC}"
    # Restart Nginx
    sudo systemctl restart nginx
    echo -e "${GREEN}Nginx restarted successfully${NC}"
else
    echo -e "${RED}Nginx configuration test failed${NC}"
    exit 1
fi

# Allow HTTP traffic
sudo ufw allow 'Nginx Full'

# Deploy the application
echo -e "\n${YELLOW}Deploying the REGEN-Repairs application...${NC}"

# Navigate to application directory - use the actual path where your code is
APP_DIR=~/REGEN-Repairs
cd $APP_DIR || { echo -e "${RED}Failed to change to application directory${NC}"; exit 1; }

# Check if there are any local changes that need to be committed
if git status --porcelain | grep -q '^[ MARC]'; then
    echo -e "${YELLOW}Local changes detected. Stashing them...${NC}"
    git stash
fi

# Pull the latest changes from the repository
echo -e "\n${YELLOW}Pulling latest changes from git...${NC}"
git pull origin main || { echo -e "${RED}Failed to pull latest changes${NC}"; exit 1; }

# Install server dependencies
echo -e "\n${YELLOW}Installing server dependencies...${NC}"
cd "$APP_DIR/server" || { echo -e "${RED}Failed to change to server directory${NC}"; exit 1; }
npm install || { echo -e "${RED}Failed to install server dependencies${NC}"; exit 1; }

# Copy production environment file if it exists
if [ -f .env.production ]; then
    cp .env.production .env
    echo -e "${GREEN}Copied production environment file${NC}"
fi

# Install client dependencies and build
echo -e "\n${YELLOW}Installing client dependencies and building...${NC}"
cd "$APP_DIR/client" || { echo -e "${RED}Failed to change to client directory${NC}"; exit 1; }
npm install || { echo -e "${RED}Failed to install client dependencies${NC}"; exit 1; }
npm run build || { echo -e "${RED}Failed to build client application${NC}"; exit 1; }

# Start or restart the application with PM2
echo -e "\n${YELLOW}Starting/restarting the application with PM2...${NC}"
cd "$APP_DIR/server" || { echo -e "${RED}Failed to change to server directory${NC}"; exit 1; }

# Check if the app is already running in PM2
if pm2 list | grep -q "regen-repairs"; then
    echo -e "${YELLOW}Restarting existing PM2 process...${NC}"
    pm2 restart ecosystem.config.js --env production || { echo -e "${RED}Failed to restart PM2 process${NC}"; exit 1; }
else
    echo -e "${YELLOW}Starting new PM2 process...${NC}"
    pm2 start ecosystem.config.js --env production || { echo -e "${RED}Failed to start PM2 process${NC}"; exit 1; }
fi

# Save PM2 process list and configure to start on reboot
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp $HOME

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}  Deployment completed successfully!  ${NC}"
echo -e "${GREEN}  Application is now running at http://repairs.regen.pk  ${NC}"
echo -e "${GREEN}===============================================${NC}"