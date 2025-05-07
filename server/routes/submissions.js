const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/SubmissionController');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://iconztzeoztncnojkmoy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb256dHplb3p0bmNub2prbW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTM4NzksImV4cCI6MjA2MDAyOTg3OX0.Gb0C7hkvzWMSaxvKI-P1SfdPY36Yg7qkSPUvGuWP0KE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get Zapier webhook URL from environment variables
const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/12005261/2n6k70r/';

/**
 * GET /api/submissions
 * Get all submissions
 */
router.get('/', SubmissionController.getAllSubmissions);

/**
 * GET /api/submissions/:id
 * Get submission by ID
 */
router.get('/:id', SubmissionController.getSubmissionById);

/**
 * POST /api/submissions
 * Create a new submission
 */
router.post('/', async (req, res, next) => {
  try {
    const formData = req.body;
    
    // Add default status and timestamp
    const submission = {
      ...formData,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    console.log('Processing submission in route handler');
    
    const { data, error } = await supabase
      .from('submissions')
      .insert([submission])
      .select();
    
    if (error) throw error;
    
    // Manually trigger Zapier webhook after successful submission
    try {
      console.log('Sending data to Zapier webhook from route handler:', ZAPIER_WEBHOOK_URL);
      
      const zapierResponse = await axios.post(ZAPIER_WEBHOOK_URL, {
        ...submission,
        id: data[0].id
      });
      
      console.log('Zapier webhook response:', zapierResponse.status, zapierResponse.statusText);
    } catch (zapierError) {
      console.error('Error sending data to Zapier webhook from route handler:', zapierError.message);
      // Don't fail the submission if Zapier webhook fails
    }
    
    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/submissions/:id/status
 * Update submission status
 */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: pending, in_progress, completed, cancelled',
        status: 'error'
      });
    }
    
    const { data, error } = await supabase
      .from('submissions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({
        error: 'Submission not found',
        status: 'error'
      });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;