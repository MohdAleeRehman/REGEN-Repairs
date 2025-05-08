
const supabase = require('./config/supabase');

async function checkSubmissionsTable() {
  console.log('Testing submissions table structure...');
  
  try {
    // Get the table structure
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'submissions');
      
    if (tableError) {
      console.error('Error fetching table structure:', tableError);
      return;
    }
    
    console.log('Table structure:', tables);
    
    // Check if formatted_id column exists
    const formattedIdColumn = tables.find(col => col.column_name === 'formatted_id');
    if (formattedIdColumn) {
      console.log('Found formatted_id column:', formattedIdColumn);
    } else {
      console.error('formatted_id column not found in submissions table!');
    }
    
    // Also check a sample record
    const { data: sample, error: sampleError } = await supabase
      .from('submissions')
      .select('*')
      .limit(1);
      
    if (sampleError) {
      console.error('Error fetching sample record:', sampleError);
      return;
    }
    
    console.log('Sample record:', sample);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkSubmissionsTable();
