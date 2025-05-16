const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();

try {
  // Load environment variables based on NODE_ENV
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
  const envPath = path.resolve(process.cwd(), envFile);
  
  console.log(`Attempting to load environment file: ${envPath}`);
  
  // Check if the env file exists before loading
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded environment from ${envPath}`);
  } else {
    console.log(`Environment file ${envPath} not found, falling back to .env`);
    dotenv.config();
  }
  
  const PORT = process.env.PORT || 3000;

  // Print important environment variables (without sensitive info)
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT: ${PORT}`);
  console.log(`CORS_ORIGIN: ${process.env.CORS_ORIGIN || '*'}`);
  console.log(`SUPABASE_URL is ${process.env.SUPABASE_URL ? 'set' : 'NOT SET'}`);
  console.log(`SUPABASE_ANON_KEY is ${process.env.SUPABASE_ANON_KEY ? 'set' : 'NOT SET'}`);

  // Enhanced security with helmet
  app.use(helmet({
    contentSecurityPolicy: false // Disabling CSP for now
  }));

  // Compression middleware - reduces payload size
  app.use(compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));

  // Logging middleware
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  app.use(cors(corsOptions));

  // Body parser middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Make Supabase client available to route handlers - with error handling
  try {
    const supabase = require('./config/supabase');
    app.use((req, res, next) => {
      req.supabase = supabase;
      next();
    });
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Continue without Supabase - routes will handle their own errors
  }

  // API routes
  app.use('/api/devices', require('./routes/devices'));
  app.use('/api/repairs', require('./routes/repairs'));
  app.use('/api/submissions', require('./routes/submissions'));
  app.use('/api/auth', require('./routes/auth'));

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      message: 'Server is running',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // Serve static frontend in production
  if (process.env.NODE_ENV === 'production') {
    const clientPath = path.join(__dirname, '../client/dist');
    
    if (fs.existsSync(clientPath)) {
      console.log(`Serving static files from: ${clientPath}`);
      
      // Serve static files
      app.use(express.static(clientPath));
      
      // Simple catch-all route that doesn't use path-to-regexp directly
      app.use(function(req, res) {
        // Only serve index.html for non-API routes
        if (!req.path.startsWith('/api')) {
          res.sendFile(path.join(clientPath, 'index.html'));
        } else {
          res.status(404).json({ error: 'API endpoint not found' });
        }
      });
    } else {
      console.warn(`Client build directory not found at: ${clientPath}`);
    }
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ 
      error: err.message || 'Something went wrong!',
      status: 'error'
    });
  });

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

} catch (error) {
  console.error('FATAL ERROR STARTING SERVER:', error);
  process.exit(1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});