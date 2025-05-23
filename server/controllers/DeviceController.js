const Device = require('../models/Device');
const cloudinaryService = require('../services/cloudinary');

class DeviceController {
  // Get all devices
  static async getAllDevices(req, res) {
    try {
      const devices = await Device.getAll();
      res.json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  }

  // Get device by ID
  static async getDeviceById(req, res) {
    try {
      const { id } = req.params;
      const device = await Device.getById(id);
      
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      res.json(device);
    } catch (error) {
      console.error('Error fetching device:', error);
      res.status(500).json({ error: 'Failed to fetch device' });
    }
  }

  // Get devices by brand
  static async getDevicesByBrand(req, res) {
    try {
      const { brand } = req.params;
      const devices = await Device.getByBrand(brand);
      res.json(devices);
    } catch (error) {
      console.error('Error fetching devices by brand:', error);
      res.status(500).json({ error: 'Failed to fetch devices by brand' });
    }
  }

  // Create a new device
  static async createDevice(req, res) {
    try {
      const deviceData = req.body;
      const newDevice = await Device.create(deviceData);
      res.status(201).json(newDevice);
    } catch (error) {
      console.error('Error creating device:', error);
      res.status(500).json({ error: 'Failed to create device' });
    }
  }

  // Update a device
  static async updateDevice(req, res) {
    try {
      const { id } = req.params;
      const deviceData = req.body;
      
      const updatedDevice = await Device.update(id, deviceData);
      
      if (!updatedDevice) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      res.json(updatedDevice);
    } catch (error) {
      console.error('Error updating device:', error);
      res.status(500).json({ error: 'Failed to update device' });
    }
  }

  // Delete a device
  static async deleteDevice(req, res) {
    try {
      const { id } = req.params;
      const result = await Device.delete(id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting device:', error);
      res.status(500).json({ error: 'Failed to delete device' });
    }
  }

  // Bulk import devices from CSV
  static async bulkImportDevices(req, res) {
    try {
      const devicesData = req.body;
      const result = await Device.bulkCreate(devicesData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error importing devices:', error);
      res.status(500).json({ error: 'Failed to import devices' });
    }
  }
  
  // Upload device image
  static async uploadDeviceImage(req, res) {
    try {
      const { id } = req.params;
      
      // Check if device exists
      const device = await Device.getById(id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }
      
      // Get optimized transformations
      const optimizedTransformations = cloudinaryService.getOptimizedTransformations('phone');
      
      // Upload to Cloudinary with optimized settings
      const result = await cloudinaryService.uploadImage(
        req.file.path,
        'device_images',
        {
          public_id: `device_${id}`,
          overwrite: true,
          transformation: [
            { 
              width: optimizedTransformations.width,
              height: optimizedTransformations.height,
              crop: optimizedTransformations.crop,
              quality: optimizedTransformations.quality,
              fetch_format: optimizedTransformations.fetch_format,
              dpr: optimizedTransformations.dpr,
              effect: optimizedTransformations.effect
            }
          ]
        }
      );
      
      // Update device with image URL
      const updatedDevice = await Device.updateImageUrl(id, result.url);
      
      res.json({
        success: true,
        device: updatedDevice,
        imageUrl: result.url
      });
    } catch (error) {
      console.error('Error uploading device image:', error);
      res.status(500).json({ error: 'Failed to upload device image' });
    }
  }
}

module.exports = DeviceController;