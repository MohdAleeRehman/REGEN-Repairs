const fs = require('fs');
const path = require('path');

/**
 * Ensures that the uploads directory exists
 */
function ensureUploadsDirectory() {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created at:', uploadsDir);
  } else {
    console.log('Uploads directory already exists at:', uploadsDir);
  }
}

module.exports = ensureUploadsDirectory;
