# REGEN-Repairs

A repair management system for iPhone repairs with customer submission portal and admin dashboard.

## Production Deployment on EC2

This guide will help you deploy the REGEN-Repairs application on an Amazon EC2 instance with the domain repairs.regen.pk.

### Prerequisites

1. An AWS account with EC2 access
2. An EC2 instance running Ubuntu (recommended: t2.micro for testing, t2.small or better for production)
3. SSH access to your EC2 instance
4. Domain name pointing to your EC2 instance (repairs.regen.pk)

### Deployment Steps

#### 1. Set Up Your EC2 Instance

1. Launch an EC2 instance with Ubuntu
2. Configure security groups to allow:
   - SSH (port 22)
   - HTTP (port 80)
   - HTTPS (port 443)
3. Connect to your instance via SSH
4. Configure your domain (repairs.regen.pk) to point to your EC2 instance's IP address

#### 2. Clone the Repository

Clone the repository to your home directory:
```
cd ~
git clone https://github.com/your-repo/REGEN-Repairs.git
cd REGEN-Repairs
```

#### 3. Run the Deployment Script

1. Make the script executable:
   ```
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```
   ./deploy.sh
   ```

The script will:
- Install Node.js, PM2, and Nginx
- Configure Nginx with your domain (repairs.regen.pk)
- Install dependencies and build the application
- Start the application with PM2

#### 4. SSL Configuration (Recommended)

For HTTPS support, install Certbot:

```
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d repairs.regen.pk
```

#### 5. Verify Deployment

1. Access your application at https://repairs.regen.pk
2. Check the server status:
   ```
   pm2 status
   ```

3. View server logs:
   ```
   pm2 logs regen-repairs-api
   ```

### Managing Your Application

- **Start the application**: `pm2 start regen-repairs-api`
- **Stop the application**: `pm2 stop regen-repairs-api`
- **Restart the application**: `pm2 restart regen-repairs-api`
- **View application status**: `pm2 status`
- **View logs**: `pm2 logs regen-repairs-api`

### Troubleshooting

1. **Application not accessible**:
   - Check that Nginx is running: `systemctl status nginx`
   - Verify the Node.js application is running: `pm2 status`
   - Check server logs: `pm2 logs regen-repairs-api`

2. **Database connection issues**:
   - Verify your Supabase configuration in `.env.production`
   - Check that your instance can reach the Supabase servers
   
3. **Static files not loading**:
   - Ensure the client build was successful
   - Check Nginx configuration and logs: `sudo nginx -t` and `sudo tail -f /var/log/nginx/error.log`