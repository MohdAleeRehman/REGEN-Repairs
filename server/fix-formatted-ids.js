const supabase = require('./config/supabase');

async function fixFormattedIds() {
  try {
    console.log('Checking submissions table structure...');
    
    // First check if formatted_id column exists
    const { data: sampleData, error: sampleError } = await supabase
      .from('submissions')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('Error checking submissions table:', sampleError);
      return;
    }
    
    if (!sampleData || sampleData.length === 0) {
      console.log('No submissions found in the database.');
      return;
    }
    
    // Check if the formatted_id column exists
    const hasFormattedIdColumn = 'formatted_id' in sampleData[0];
    console.log('Does formatted_id column exist?', hasFormattedIdColumn);
    
    if (!hasFormattedIdColumn) {
      console.error('The formatted_id column does not exist in the submissions table!');
      console.log('Please add it using SQL: ALTER TABLE submissions ADD COLUMN formatted_id VARCHAR(255);');
      return;
    }
    
    // Get all submissions
    const { data, error } = await supabase
      .from('submissions')
      .select('id, formatted_id, created_at')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching submissions:', error);
      return;
    }
    
    console.log(`Found ${data.length} total submissions.`);
    
    // Find submissions with missing formatted_id
    const missingFormatted = data.filter(s => !s.formatted_id);
    console.log(`Found ${missingFormatted.length} submissions without formatted_id.`);
    
    if (missingFormatted.length === 0) {
      console.log('All submissions have formatted IDs. No action needed.');
      return;
    }
    
    console.log('Generating and updating formatted IDs...');
    
    // Start from 1321 and increment by 10
    let nextNumber = 1321;
    let updated = 0;
    
    for (const submission of missingFormatted) {
      const formattedId = `#RN-RP-IP${nextNumber}`;
      console.log(`Setting ID ${submission.id} to formatted ID: ${formattedId}`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('submissions')
        .update({ formatted_id: formattedId })
        .eq('id', submission.id)
        .select();
      
      if (updateError) {
        console.error(`Error updating submission ${submission.id}:`, updateError);
      } else {
        console.log(`Successfully updated submission ${submission.id}`);
        updated++;
      }
      
      nextNumber += 10;
    }
    
    console.log(`Updated ${updated} out of ${missingFormatted.length} submissions.`);
    console.log('Next available formatted ID number should be:', nextNumber);
    
  } catch (err) {
    console.error('Error in fixFormattedIds:', err);
  }
}

// Run the function
fixFormattedIds()
  .then(() => console.log('Script completed.'))
  .catch(err => console.error('Script failed:', err));