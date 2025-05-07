const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://iconztzeoztncnojkmoy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb256dHplb3p0bmNub2prbW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTM4NzksImV4cCI6MjA2MDAyOTg3OX0.Gb0C7hkvzWMSaxvKI-P1SfdPY36Yg7qkSPUvGuWP0KE';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route   GET /api/repairs
 * @desc    Get all repairs
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching repairs:', error);
    res.status(500).json({ error: 'Failed to fetch repairs' });
  }
});

/**
 * @route   GET /api/repairs/pricing
 * @desc    Get structured pricing data for all devices
 * @access  Public
 */
router.get('/pricing', async (req, res) => {
  try {
    // Get all repairs from the database
    const { data: repairs, error } = await supabase
      .from('repairs')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Get all devices to map device_id to model names
    const { data: devices, deviceError } = await supabase
      .from('devices')
      .select('*');
    
    if (deviceError) {
      throw deviceError;
    }
    
    // Create a map of device_id to model name
    const deviceMap = {};
    devices.forEach(device => {
      deviceMap[device.id] = device.model;
    });
    
    // Structure the data by device model and repair type
    const pricingData = {};
    
    repairs.forEach(repair => {
      const deviceModel = deviceMap[repair.device_id];
      
      if (!deviceModel) return; // Skip if device model not found
      
      // Initialize device model in pricing data if not exists
      if (!pricingData[deviceModel]) {
        pricingData[deviceModel] = {};
      }
      
      // Handle different repair types
      switch (repair.type) {
        case 'battery':
        case 'display':
        case 'earpiece':
        case 'speaker':
          // For battery, display, earpiece and speaker, we have OEM and Aftermarket options
          if (!pricingData[deviceModel][repair.type]) {
            pricingData[deviceModel][repair.type] = {};
          }
          
          // Set the price for the specific option
          pricingData[deviceModel][repair.type][repair.option] = repair.price;
          break;
          
        default:
          // For other repair types
          if (!pricingData[deviceModel][repair.type]) {
            pricingData[deviceModel][repair.type] = {};
          }
          
          pricingData[deviceModel][repair.type][repair.option] = repair.price;
      }
    });
    
    res.json(pricingData);
  } catch (error) {
    console.error('Error generating pricing data:', error);
    res.status(500).json({ error: 'Failed to generate pricing data' });
  }
});

/**
 * @route   GET /api/repairs/:id
 * @desc    Get repair by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Repair not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching repair:', error);
    res.status(500).json({ error: 'Failed to fetch repair' });
  }
});

/**
 * @route   GET /api/repairs/device/:deviceId
 * @desc    Get repairs for a specific device
 * @access  Public
 */
router.get('/device/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .eq('device_id', deviceId)
      .order('name', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching device repairs:', error);
    res.status(500).json({ error: 'Failed to fetch repairs for this device' });
  }
});

/**
 * @route   POST /api/repairs
 * @desc    Create a new repair
 * @access  Private (this would normally have authentication)
 */
router.post('/', async (req, res) => {
  try {
    const newRepair = req.body;
    
    const { data, error } = await supabase
      .from('repairs')
      .insert([newRepair])
      .select();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating repair:', error);
    res.status(500).json({ error: 'Failed to create repair' });
  }
});

/**
 * @route   PUT /api/repairs/:id
 * @desc    Update a repair
 * @access  Private (this would normally have authentication)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('repairs')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Repair not found' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating repair:', error);
    res.status(500).json({ error: 'Failed to update repair' });
  }
});

/**
 * @route   DELETE /api/repairs/:id
 * @desc    Delete a repair
 * @access  Private (this would normally have authentication)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('repairs')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    res.json({ message: 'Repair deleted successfully' });
  } catch (error) {
    console.error('Error deleting repair:', error);
    res.status(500).json({ error: 'Failed to delete repair' });
  }
});

module.exports = router;