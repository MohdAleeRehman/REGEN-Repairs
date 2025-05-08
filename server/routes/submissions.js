const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/SubmissionController');
const Submission = require('../models/Submission');
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
    
    // Log the incoming data
    console.log('Received submission data in route handler:', JSON.stringify(formData, null, 2));
    
    // Use the Submission model's create method to properly handle formatted_id generation
    const newSubmission = await Submission.create(formData);
    
    console.log('Submission created with data:', JSON.stringify(newSubmission, null, 2));
    
    // Manually trigger Zapier webhook after successful submission
    try {
      console.log('Sending data to Zapier webhook from route handler:', ZAPIER_WEBHOOK_URL);
      
      const zapierResponse = await axios.post(ZAPIER_WEBHOOK_URL, {
        ...formData,
        id: newSubmission.id,
        formatted_id: newSubmission.formatted_id // Include formatted_id in Zapier payload
      });
      
      console.log('Zapier webhook response:', zapierResponse.status, zapierResponse.statusText);
    } catch (zapierError) {
      console.error('Error sending data to Zapier webhook from route handler:', zapierError.message);
      // Don't fail the submission if Zapier webhook fails
    }
    
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('Error in submission route handler:', error);
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
    
    // Log the entire request for debugging
    console.log(`Status update request for ID ${id}:`, {
      body: req.body,
      headers: req.headers,
      method: req.method
    });
    
    // Destructure after logging to debug
    const { status, cancellation_notes } = req.body;
    
    console.log(`Route handler: Attempting to update submission ID: ${id} to status: ${status}`);
    console.log(`Request body:`, JSON.stringify(req.body, null, 2));
    console.log(`Cancellation notes from request:`, cancellation_notes);
    
    if (!status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      console.log(`Invalid status provided: ${status}`);
      return res.status(400).json({
        error: 'Invalid status. Must be one of: pending, in_progress, completed, cancelled',
        status: 'error'
      });
    }
    
    // Prepare data for update - include all relevant fields from request body
    const updateData = { status };
    
    // If status is cancelled and cancellation_notes is provided, include it
    if (status === 'cancelled' && cancellation_notes) {
      updateData.cancellation_notes = cancellation_notes;
      console.log(`Including cancellation notes in update: "${cancellation_notes}"`);
    } else if (status === 'cancelled') {
      console.log(`No cancellation notes provided for cancelled status.`);
    }
    
    // Use the Submission model's update method which now handles ID conversion properly
    try {
      const result = await Submission.update(id, updateData);
      
      if (!result) {
        console.log(`No submission found with ID: ${id}`);
        return res.status(404).json({
          error: 'Submission not found',
          status: 'error'
        });
      }
      
      console.log(`Successfully updated submission ${id} to ${status}`);
      console.log(`Response data:`, JSON.stringify(result, null, 2));
      return res.status(200).json(result);
      
    } catch (updateError) {
      console.error('Error updating submission status:', updateError);
      return res.status(500).json({
        error: 'Failed to update submission status',
        details: updateError.message,
        status: 'error'
      });
    }
  } catch (error) {
    console.error('Unexpected error in status update route handler:', error);
    next(error);
  }
});

module.exports = router;