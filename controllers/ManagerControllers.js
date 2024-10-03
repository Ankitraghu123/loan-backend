const ManagerModel = require('../models/ManagerModel');
const asyncHandler = require('express-async-handler');

// Add Manager
const addManager = asyncHandler(async (req, res) => {
  const { name, email, password, mobile} = req.body;

  try {
    // Check if the email already exists
    const existingManager = await ManagerModel.findOne({ email });
    if (existingManager) {
      return res.status(400).json({
        success: false,
        message: 'Manager with this email already exists',
      });
    }

    // Create and save new manager
    const manager = new ManagerModel({
      name,
      email,
      password, // Storing password as plain text based on your requirement
      mobile,
    });

    await manager.save();

    res.status(201).json({
      success: true,
      message: 'Manager added successfully',
      data: manager,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add manager',
      error: error.message,
    });
  }
});

const editManager = asyncHandler(async (req, res) => {
    const { id } = req.params; // Manager ID from params
    const { name, email, password, mobile } = req.body;
  
    try {
      const manager = await ManagerModel.findById(id);
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: 'Manager not found',
        });
      }
  
      // Update manager details
      manager.name = name || manager.name;
      manager.email = email || manager.email;
      manager.password = password || manager.password;
      manager.mobile = mobile || manager.mobile;
  
      await manager.save();
  
      res.status(200).json({
        success: true,
        message: 'Manager updated successfully',
        data: manager,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update manager',
        error: error.message,
      });
    }
  });


  const deleteManager = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      const manager = await ManagerModel.findByIdAndDelete(id);
  
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: 'Manager not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Manager deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete manager',
        error: error.message,
      });
    }
  });

  const getAllManagers = asyncHandler(async (req, res) => {
    try {
      const Managers = await ManagerModel.find();
  
      res.status(200).json({
        success: true,
        data: Managers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch Managers',
        error: error.message,
      });
    }
  });
  

module.exports = { addManager, editManager, deleteManager, getAllManagers };
