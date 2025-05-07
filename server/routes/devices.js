const express = require('express');
const DeviceController = require('../controllers/DeviceController');

const router = express.Router();

// GET all devices
router.get('/', DeviceController.getAllDevices);

// GET device by ID
router.get('/:id', DeviceController.getDeviceById);

// GET devices by brand
router.get('/brand/:brand', DeviceController.getDevicesByBrand);

// POST create a new device
router.post('/', DeviceController.createDevice);

// POST bulk import devices
router.post('/import', DeviceController.bulkImportDevices);

// PUT update a device
router.put('/:id', DeviceController.updateDevice);

// DELETE a device
router.delete('/:id', DeviceController.deleteDevice);

module.exports = router;