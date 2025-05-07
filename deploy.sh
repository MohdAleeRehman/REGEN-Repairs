#!/bin/bash

# REGEN-Repairs deployment script for EC2

# Update system packages
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js and npm if not already installed
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "Installing PM2 for process management..."
sudo npm install pm2 -g

# Install Nginx if not already installed
echo "Installing Nginx for reverse proxy..."
sudo apt-get install -y nginx

# Create Nginx configuration
echo "Configuring Nginx as reverse proxy..."
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
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Allow HTTP traffic
sudo ufw allow 'Nginx Full'

# Deploy the application
echo "Deploying the REGEN-Repairs application..."

# Navigate to application directory
cd ~/REGEN-Repairs  # Using home directory as the deployment path

# Install dependencies for server and client
echo "Installing server dependencies..."
cd server
npm install --production

# Copy production environment file
cp .env.production .env

# Build the client application
echo "Building client application..."
cd ../client
npm install
npm run build

# Start the application with PM2
echo "Starting the application with PM2..."
cd ../server
pm2 start ecosystem.config.js --env production

# Save PM2 process list and configure to start on reboot
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "Deployment completed successfully!"