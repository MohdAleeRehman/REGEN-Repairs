const supabase = require('../config/supabase');

class Repair {
  // Get all repairs
  static async getAll() {
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .order('type, name');
    
    if (error) throw error;
    return data;
  }

  // Get repair by ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get repairs by device ID
  static async getByDeviceId(deviceId) {
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .eq('device_id', deviceId)
      .order('price');
    
    if (error) throw error;
    return data;
  }

  // Create a new repair
  static async create(repairData) {
    const { data, error } = await supabase
      .from('repairs')
      .insert([repairData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Update a repair
  static async update(id, repairData) {
    const { data, error } = await supabase
      .from('repairs')
      .update(repairData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Delete a repair
  static async delete(id) {
    const { error } = await supabase
      .from('repairs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }

  // Import repairs from CSV
  static async bulkCreate(repairsData) {
    const { data, error } = await supabase
      .from('repairs')
      .insert(repairsData)
      .select();
    
    if (error) throw error;
    return data;
  }
}

module.exports = Repair;