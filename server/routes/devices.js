const express = require('express');
const multer = require('multer');
const path = require('path');
const DeviceController = require('../controllers/DeviceController');
const adminAuth = require('../middleware/adminAuth'); // Import admin auth middleware

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET all devices
router.get('/', DeviceController.getAllDevices);

// GET device by ID
router.get('/:id', DeviceController.getDeviceById);

// GET devices by brand
router.get('/brand/:brand', DeviceController.getDevicesByBrand);

// Admin-only routes
// POST create a new device
router.post('/', adminAuth, DeviceController.createDevice);

// POST bulk import devices
router.post('/import', adminAuth, DeviceController.bulkImportDevices);

// PUT update a device
router.put('/:id', adminAuth, DeviceController.updateDevice);

// DELETE a device
router.delete('/:id', adminAuth, DeviceController.deleteDevice);

// POST upload device image
router.post('/:id/image', adminAuth, upload.single('image'), DeviceController.uploadDeviceImage);

module.exports = router;