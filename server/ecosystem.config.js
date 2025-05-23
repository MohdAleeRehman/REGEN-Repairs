module.exports = {
  apps: [
    {
      name: 'regen-repairs-api',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};