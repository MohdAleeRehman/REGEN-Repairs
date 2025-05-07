const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
// Import the supabase client from the config file instead of creating a new one
const supabase = require('./config/supabase');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced security with helmet
app.use(helmet());

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

// Make Supabase client available to route handlers
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
app.use('/api/devices', require('./routes/devices'));
app.use('/api/repairs', require('./routes/repairs'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/auth', require('./routes/auth'));

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the client build directory
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // For any other route, send the index.html file
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: err.message || 'Something went wrong!',
    status: 'error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // For production, we might want to exit when this happens
  // process.exit(1);
});