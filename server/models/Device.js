const supabase = require('../config/supabase');

class Device {
  // Get all devices
  static async getAll() {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('brand, model');
    
    if (error) throw error;
    return data;
  }

  // Get device by ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get devices by brand
  static async getByBrand(brand) {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('brand', brand)
      .order('model');
    
    if (error) throw error;
    return data;
  }

  // Create a new device
  static async create(deviceData) {
    // Generate a device ID if one is not provided
    if (!deviceData.id) {
      // Create an ID based on the model: device_iphone_11 format
      const baseId = deviceData.model.toLowerCase().replace(/\s+/g, '_');
      deviceData.id = `device_${baseId}`;
      
      console.log(`Generated device ID: ${deviceData.id} for model: ${deviceData.model}`);
    }
    
    const { data, error } = await supabase
      .from('devices')
      .insert([deviceData])
      .select();
    
    if (error) {
      console.error('Error creating device:', error);
      throw error;
    }
    return data[0];
  }

  // Update a device
  static async update(id, deviceData) {
    const { data, error } = await supabase
      .from('devices')
      .update(deviceData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
  
  // Update device image URL
  static async updateImageUrl(id, imageUrl) {
    const { data, error } = await supabase
      .from('devices')
      .update({ image_url: imageUrl })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Delete a device
  static async delete(id) {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }

  // Import devices from CSV
  static async bulkCreate(devicesData) {
    const { data, error } = await supabase
      .from('devices')
      .insert(devicesData)
      .select();
    
    if (error) throw error;
    return data;
  }
}

module.exports = Device;