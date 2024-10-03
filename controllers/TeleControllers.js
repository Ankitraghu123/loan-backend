const TelecallerModel = require('../models/TelecallerModel');
const asyncHandler = require('express-async-handler');

// Add Telecaller
const addTelecaller = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, role } = req.body;

  try {
    // Check if the email already exists
    const existingTelecaller = await TelecallerModel.findOne({ email });
    if (existingTelecaller) {
      return res.status(400).json({
        success: false,
        message: 'Telecaller with this email already exists',
      });
    }

    // Create and save new telecaller
    const telecaller = new TelecallerModel({
      name,
      email,
      password, // Storing password as plain text based on your requirement
      mobile,
      role, // Optional: role will default to 'telecaller' if not provided
    });

    await telecaller.save();

    res.status(201).json({
      success: true,
      message: 'Telecaller added successfully',
      data: telecaller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add telecaller',
      error: error.message,
    });
  }
});

const editTelecaller = asyncHandler(async (req, res) => {
    const { id } = req.params; // Telecaller ID from params
    const { name, email, password, mobile, role } = req.body;
  
    try {
      const telecaller = await TelecallerModel.findById(id);
      if (!telecaller) {
        return res.status(404).json({
          success: false,
          message: 'Telecaller not found',
        });
      }
  
      // Update telecaller details
      telecaller.name = name || telecaller.name;
      telecaller.email = email || telecaller.email;
      telecaller.password = password || telecaller.password;
      telecaller.mobile = mobile || telecaller.mobile;
      telecaller.role = role || telecaller.role;
  
      await telecaller.save();
  
      res.status(200).json({
        success: true,
        message: 'Telecaller updated successfully',
        data: telecaller,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update telecaller',
        error: error.message,
      });
    }
  });


  const deleteTelecaller = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      const telecaller = await TelecallerModel.findByIdAndDelete(id);
  
      if (!telecaller) {
        return res.status(404).json({
          success: false,
          message: 'Telecaller not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Telecaller deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete telecaller',
        error: error.message,
      });
    }
  });

  const getAllTelecallers = asyncHandler(async (req, res) => {
    try {
      const telecallers = await TelecallerModel.find();
  
      res.status(200).json({
        success: true,
        data: telecallers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch telecallers',
        error: error.message,
      });
    }
  });
  

module.exports = { addTelecaller, editTelecaller, deleteTelecaller, getAllTelecallers };
