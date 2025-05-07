const supabase = require('../config/supabase');

class Submission {
  // Get all submissions
  static async getAll() {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get submission by ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Create a new submission
  static async create(submissionData) {
    const { data, error } = await supabase
      .from('submissions')
      .insert([{
        ...submissionData,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Update a submission
  static async update(id, submissionData) {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        ...submissionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Delete a submission
  static async delete(id) {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }

  // Get submissions by status
  static async getByStatus(status) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get submissions by user email
  static async getByEmail(email) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

module.exports = Submission;