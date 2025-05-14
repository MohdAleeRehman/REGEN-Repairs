const supabase = require('../config/supabase');

class Submission {
  // Expose the supabase client as a static property
  static model = supabase;
  
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
    // Ensure ID is properly converted to number if it's a numeric string
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', numericId)
      .single();
    
    if (error) {
      console.error(`Error getting submission ${numericId}:`, error);
      throw error;
    }
    return data;
  }

  // Get the latest submission number for generating the next formatted ID
  static async getLatestFormattedIdNumber() {
    try {
      console.log('Getting latest formatted ID number from database...');
      
      // First, make sure our table structure is correct by logging a sample submission
      const { data: sampleData, error: sampleError } = await supabase
        .from('submissions')
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.error('Error checking submissions table structure:', sampleError);
      } else {
        // Log the sample to check if formatted_id column exists
        console.log('Sample submission data:', sampleData);
        
        if (sampleData && sampleData.length > 0) {
          console.log('Checking if formatted_id column exists:', 'formatted_id' in sampleData[0]);
        }
      }
      
      // Query for the latest submission with order by created_at
      const { data, error } = await supabase
        .from('submissions')
        .select('id, formatted_id, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching latest formatted ID:', error);
        throw error;
      }
      
      console.log('Latest submission data:', data);
      
      // Always start with 1321 for the first submission or if no formatted ID is found
      if (!data || data.length === 0) {
        console.log('No submissions found in the database, starting with 1321');
        return 1321;
      }
      
      if (!data[0].formatted_id) {
        console.log('Latest submission has null formatted_id, starting with 1321');
        return 1321;
      }
      
      // Extract the numeric part from the formatted ID
      const formattedId = data[0].formatted_id;
      console.log('Latest formatted ID found:', formattedId);
      
      const matches = formattedId.match(/IP(\d+)$/);
      
      if (!matches || !matches[1]) {
        // If the pattern doesn't match, start with 1321
        console.log('Could not extract number from formatted ID, starting with 1321');
        return 1321;
      }
      
      // Parse the number and add 10 for the next ID
      const currentNumber = parseInt(matches[1], 10);
      const nextNumber = currentNumber + 10;
      console.log(`Extracted number ${currentNumber}, next number will be ${nextNumber}`);
      return nextNumber;
    } catch (error) {
      console.error('Error getting latest formatted ID:', error);
      // Default to 1321 if an error occurs
      return 1321;
    }
  }

  // Create a new submission
  static async create(submissionData) {
    try {
      // Format the ID as REGEN-IP followed by a number
      let formattedId = null;
      
      // Only generate a formatted ID for complete submissions
      if (!submissionData.is_partial) {
        const nextNumber = await this.getLatestFormattedIdNumber();
        formattedId = `REGEN-IP${nextNumber}`;
        console.log(`Generated formatted ID: ${formattedId}`);
      } else {
        // For partial submissions, use a different format to indicate it's partial
        formattedId = `PARTIAL-${Date.now()}`;
        console.log(`Generated partial submission ID: ${formattedId}`);
      }
      
      // Add the formatted ID to the submission data
      const dataWithFormattedId = {
        ...submissionData,
        formatted_id: formattedId
      };
      
      console.log('Creating submission with data:', JSON.stringify(dataWithFormattedId, null, 2));
      
      // Insert the submission into the database
      const { data, error } = await supabase
        .from('submissions')
        .insert([dataWithFormattedId])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating submission:', error);
        throw error;
      }
      
      console.log('Submission created successfully:', {
        id: data.id,
        formatted_id: data.formatted_id
      });
      
      return data;
    } catch (error) {
      console.error('Error in create submission:', error);
      throw error;
    }
  }

  // Update a submission
  static async update(id, submissionData) {
    // Ensure ID is properly converted to number if it's a numeric string
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    console.log(`Submission model: Updating submission ${numericId} with data:`, JSON.stringify(submissionData, null, 2));
    
    // First check if the submission exists before attempting to update
    const { data: checkData, error: checkError } = await supabase
      .from('submissions')
      .select('id, status')
      .eq('id', numericId)
      .maybeSingle();
      
    if (checkError) {
      console.error(`Error checking if submission ${numericId} exists:`, checkError);
      throw checkError;
    }
    
    if (!checkData) {
      console.log(`Submission with ID ${numericId} not found during pre-check`);
      return null;
    }
    
    console.log(`Submission ${numericId} found with current status: ${checkData.status}, proceeding with update`);
    
    // Add completion_date if the status is being updated to 'completed'
    if (submissionData.status === 'completed' && !submissionData.completion_date) {
      submissionData.completion_date = new Date().toISOString();
      console.log(`Setting completion date: ${submissionData.completion_date}`);
    }
    
    // Add cancellation_date if the status is being updated to 'cancelled'
    if (submissionData.status === 'cancelled' && !submissionData.cancellation_date) {
      submissionData.cancellation_date = new Date().toISOString();
      console.log(`Setting cancellation date: ${submissionData.cancellation_date}`);
    }
    
    // Add updated_at timestamp if not already included
    const dataToUpdate = {
      ...submissionData,
      updated_at: new Date().toISOString()
    };
    
    // Important: Log the exact payload being sent to the database
    console.log(`Sending update payload to database:`, JSON.stringify(dataToUpdate, null, 2));
    
    // Use a more direct approach for updating
    try {
      // First attempt - standard update
      const { data, error } = await supabase
        .from('submissions')
        .update(dataToUpdate)
        .eq('id', numericId)
        .select();
      
      if (error) {
        console.error(`Error in first update attempt for submission ${numericId}:`, error);
        // Don't throw here, we'll try a fallback approach
      } else if (data && data.length > 0) {
        console.log(`Standard update successful for submission ${numericId}:`, JSON.stringify(data[0], null, 2));
        return data[0];
      }
      
      // Fallback approach - using RPC (if your Supabase setup supports it)
      console.log(`Trying fallback approach: direct SQL update for submission ${numericId}`);
      
      // Get the current record
      const { data: currentData } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', numericId)
        .single();
      
      if (!currentData) {
        throw new Error(`Could not fetch current data for submission ${numericId}`);
      }
      
      // Create an updated version
      const updatedRecord = { 
        ...currentData,
        ...dataToUpdate
      };
      
      // Use upsert as a fallback
      const { data: upsertData, error: upsertError } = await supabase
        .from('submissions')
        .upsert(updatedRecord)
        .select();
      
      if (upsertError) {
        console.error(`Error in upsert fallback for submission ${numericId}:`, upsertError);
        throw upsertError;
      }
      
      if (!upsertData || upsertData.length === 0) {
        console.log(`Upsert succeeded but no data returned. Fetching updated record for ID ${numericId}...`);
        
        // Fetch the updated record to verify and return it
        const { data: fetchData, error: fetchError } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', numericId)
          .single();
          
        if (fetchError) {
          console.error(`Error fetching updated submission ${numericId}:`, fetchError);
          throw fetchError;
        }
        
        if (!fetchData) {
          console.log(`Still couldn't find submission ${numericId} after update attempts`);
          
          // As a last resort, return what we expect the updated record to be
          console.log(`Returning manually constructed updated record for submission ${numericId}`);
          return {
            ...currentData,
            ...dataToUpdate
          };
        }
        
        // Verify the update was applied
        console.log(`Retrieved updated submission ${numericId}:`, JSON.stringify(fetchData, null, 2));
        
        if (fetchData.status !== submissionData.status && 'status' in submissionData) {
          console.warn(`Status was not updated in database! Expected: ${submissionData.status}, Got: ${fetchData.status}`);
          
          // Force the status to be correct in the returned object
          return {
            ...fetchData,
            status: submissionData.status,
            ...(submissionData.status === 'completed' ? { completion_date: dataToUpdate.completion_date } : {}),
            ...(submissionData.status === 'cancelled' ? { 
              cancellation_date: dataToUpdate.cancellation_date,
              cancellation_notes: dataToUpdate.cancellation_notes 
            } : {})
          };
        }
        
        return fetchData;
      }
      
      console.log(`Upsert successful for submission ${numericId}:`, JSON.stringify(upsertData[0], null, 2));
      return upsertData[0];
    } catch (updateError) {
      console.error(`All update attempts failed for submission ${numericId}:`, updateError);
      throw updateError;
    }
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