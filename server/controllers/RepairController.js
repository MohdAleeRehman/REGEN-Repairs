const Repair = require('../models/Repair');

class RepairController {
  // Get all repairs
  static async getAllRepairs(req, res) {
    try {
      const repairs = await Repair.getAll();
      res.json(repairs);
    } catch (error) {
      console.error('Error fetching repairs:', error);
      res.status(500).json({ error: 'Failed to fetch repairs' });
    }
  }

  // Get repair by ID
  static async getRepairById(req, res) {
    try {
      const { id } = req.params;
      const repair = await Repair.getById(id);
      
      if (!repair) {
        return res.status(404).json({ error: 'Repair not found' });
      }
      
      res.json(repair);
    } catch (error) {
      console.error('Error fetching repair:', error);
      res.status(500).json({ error: 'Failed to fetch repair' });
    }
  }

  // Get repairs by device ID
  static async getRepairsByDeviceId(req, res) {
    try {
      const { deviceId } = req.params;
      const repairs = await Repair.getByDeviceId(deviceId);
      res.json(repairs);
    } catch (error) {
      console.error('Error fetching repairs by device:', error);
      res.status(500).json({ error: 'Failed to fetch repairs by device' });
    }
  }

  // Create a new repair
  static async createRepair(req, res) {
    try {
      const repairData = req.body;
      const newRepair = await Repair.create(repairData);
      res.status(201).json(newRepair);
    } catch (error) {
      console.error('Error creating repair:', error);
      res.status(500).json({ error: 'Failed to create repair' });
    }
  }

  // Update a repair
  static async updateRepair(req, res) {
    try {
      const { id } = req.params;
      const repairData = req.body;
      
      const updatedRepair = await Repair.update(id, repairData);
      
      if (!updatedRepair) {
        return res.status(404).json({ error: 'Repair not found' });
      }
      
      res.json(updatedRepair);
    } catch (error) {
      console.error('Error updating repair:', error);
      res.status(500).json({ error: 'Failed to update repair' });
    }
  }

  // Delete a repair
  static async deleteRepair(req, res) {
    try {
      const { id } = req.params;
      const result = await Repair.delete(id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting repair:', error);
      res.status(500).json({ error: 'Failed to delete repair' });
    }
  }

  // Bulk import repairs from CSV
  static async bulkImportRepairs(req, res) {
    try {
      const repairsData = req.body;
      const result = await Repair.bulkCreate(repairsData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error importing repairs:', error);
      res.status(500).json({ error: 'Failed to import repairs' });
    }
  }
}

module.exports = RepairController;