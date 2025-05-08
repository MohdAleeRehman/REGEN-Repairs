const Submission = require('../models/Submission');
const axios = require('axios');

// Zapier webhook URL
const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/12005261/2n6k70r/';

class SubmissionController {
  // Get all submissions
  static async getAllSubmissions(req, res) {
    try {
      const submissions = await Submission.getAll();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  }

  // Get submission by ID
  static async getSubmissionById(req, res) {
    try {
      const { id } = req.params;
      const submission = await Submission.getById(id);
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      res.json(submission);
    } catch (error) {
      console.error('Error fetching submission:', error);
      res.status(500).json({ error: 'Failed to fetch submission' });
    }
  }

  // Create a new submission
  static async createSubmission(req, res) {
    try {
      const formData = req.body;
      
      // Map form fields to match the database schema
      const submissionData = {
        name: formData.name || formData.full_name,
        email: formData.email || formData.whatsapp_number, // Using WhatsApp as email
        phone: formData.phone || formData.whatsapp_number,
        device_id: formData.device_id,
        repair_ids: formData.repair_ids || [],
        status: 'pending',
        problems: formData.problems,
        battery_option: formData.battery_option,
        display_option: formData.display_option,
        battery_add_on: formData.battery_add_on,
        earpiece_option: formData.earpiece_option,
        speaker_option: formData.speaker_option,
        charging_issue_type: formData.charging_issue_type,
        dead_phone_issue_type: formData.dead_phone_issue_type,
        other_problem_description: formData.other_problem_description,
        service_history: formData.service_history,
        previous_repair_by: formData.previous_repair_by,
        previous_repair_details: formData.previous_repair_details,
        previous_repair_other_details: formData.previous_repair_other_details,
        is_from_lahore: formData.is_from_lahore,
        needs_pickup_delivery: formData.needs_pickup_delivery,
        address: formData.address,
        agreed_to_terms: formData.agreed_to_terms,
        calculated_price: formData.calculated_price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Submitting data to database:", JSON.stringify(submissionData, null, 2));
      
      // Create submission in database with formatted ID
      const newSubmission = await Submission.create(submissionData);
      
      console.log("Submission created successfully:", {
        id: newSubmission.id,
        formatted_id: newSubmission.formatted_id
      });
      
      // Send data to Zapier webhook
      try {
        console.log('Sending data to Zapier webhook:', ZAPIER_WEBHOOK_URL);
        
        const zapierPayload = {
          ...formData,
          id: newSubmission.id,
          formatted_id: newSubmission.formatted_id, // Include formatted ID in Zapier payload
          created_at: newSubmission.created_at
        };
        
        console.log('Zapier payload:', JSON.stringify(zapierPayload, null, 2));
        
        const zapierResponse = await axios.post(ZAPIER_WEBHOOK_URL, zapierPayload);
        console.log('Submission data sent to Zapier webhook successfully. Response:', zapierResponse.status, zapierResponse.statusText);
      } catch (zapierError) {
        // Log the detailed error but don't fail the submission if Zapier webhook fails
        console.error('Error sending data to Zapier webhook:', {
          message: zapierError.message,
          response: zapierError.response ? {
            status: zapierError.response.status,
            data: zapierError.response.data
          } : 'No response data',
          request: zapierError.request ? 'Request was made but no response received' : 'No request was made',
          config: zapierError.config ? {
            url: zapierError.config.url,
            method: zapierError.config.method,
            headers: zapierError.config.headers
          } : 'No config available'
        });
      }
      
      res.status(201).json(newSubmission);
    } catch (error) {
      console.error('Error creating submission:', error);
      res.status(500).json({ 
        error: 'Failed to create submission: ' + error.message,
        details: error.stack
      });
    }
  }

  // Update a submission
  static async updateSubmission(req, res) {
    try {
      const { id } = req.params;
      const submissionData = req.body;
      
      const updatedSubmission = await Submission.update(id, submissionData);
      
      if (!updatedSubmission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      res.json(updatedSubmission);
    } catch (error) {
      console.error('Error updating submission:', error);
      res.status(500).json({ error: 'Failed to update submission' });
    }
  }

  // Delete a submission
  static async deleteSubmission(req, res) {
    try {
      const { id } = req.params;
      const result = await Submission.delete(id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting submission:', error);
      res.status(500).json({ error: 'Failed to delete submission' });
    }
  }

  // Get submissions by status
  static async getSubmissionsByStatus(req, res) {
    try {
      const { status } = req.params;
      const submissions = await Submission.getByStatus(status);
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions by status:', error);
      res.status(500).json({ error: 'Failed to fetch submissions by status' });
    }
  }

  // Get submissions by user email
  static async getSubmissionsByEmail(req, res) {
    try {
      const { email } = req.params;
      const submissions = await Submission.getByEmail(email);
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions by email:', error);
      res.status(500).json({ error: 'Failed to fetch submissions by email' });
    }
  }
}

module.exports = SubmissionController;