const express = require('express');
const router = express.Router();

// Route to automatically confirm a user's email
router.post('/confirm-email', async (req, res) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }

    // First attempt: Try to call the admin_confirm_user function directly
    const { error } = await req.supabase.rpc('admin_confirm_user', { 
      userid: user_id 
    });

    if (error) {
      console.error('Error calling admin_confirm_user function:', error);
      
      // Fallback: Insert into admin_operations table to trigger the confirmation
      const { error: insertError } = await req.supabase
        .from('admin_operations')
        .insert({
          operation: 'confirm_email',
          user_id: user_id,
          metadata: { confirmed_at: new Date().toISOString() }
        });

      if (insertError) {
        throw insertError;
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'User email confirmed successfully'
    });
  } catch (err) {
    console.error('Server error confirming email:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to confirm email',
      error: err.message
    });
  }
});

// Route to create a new admin user (handles both signup and confirmation)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, admin_code } = req.body;
    
    // Validate required fields
    if (!email || !password || !admin_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, password, and admin code are required'
      });
    }
    
    // Verify admin code
    const ADMIN_CODE = process.env.ADMIN_CODE || 'REGEN2025';
    if (admin_code !== ADMIN_CODE) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid admin code'
      });
    }
    
    // Create the user
    const { data: userData, error: createError } = await req.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: { role: 'admin' }
    });
    
    if (createError) {
      throw createError;
    }
    
    return res.status(201).json({
      status: 'success',
      message: 'Admin user created successfully',
      data: {
        user_id: userData.user.id,
        email: userData.user.email
      }
    });
  } catch (err) {
    console.error('Server error creating admin user:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create admin user',
      error: err.message
    });
  }
});

module.exports = router;