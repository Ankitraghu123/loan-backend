const SalesExecutiveModel = require('../models/SalesExecutiveModel');
const asyncHandler = require('express-async-handler');

// Add SalesExecutive
const addSalesExecutive = asyncHandler(async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    // Check if the email already exists
    const existingSalesExecutive = await SalesExecutiveModel.findOne({ email });
    if (existingSalesExecutive) {
      return res.status(400).json({
        success: false,
        message: 'SalesExecutive with this email already exists',
      });
    }

    // Create and save new salesExecutive
    const salesExecutive = new SalesExecutiveModel({
      name,
      email,
      password, 
      mobile, 
    });

    await salesExecutive.save();

    res.status(201).json({
      success: true,
      message: 'SalesExecutive added successfully',
      data: salesExecutive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add salesExecutive',
      error: error.message,
    });
  }
});

const editSalesExecutive = asyncHandler(async (req, res) => {
    const { id } = req.params; // SalesExecutive ID from params
    const { name, email, password, mobile } = req.body;
  
    try {
      const salesExecutive = await SalesExecutiveModel.findById(id);
      if (!salesExecutive) {
        return res.status(404).json({
          success: false,
          message: 'SalesExecutive not found',
        });
      }
  
      // Update salesExecutive details
      salesExecutive.name = name || salesExecutive.name;
      salesExecutive.email = email || salesExecutive.email;
      salesExecutive.password = password || salesExecutive.password;
      salesExecutive.mobile = mobile || salesExecutive.mobile;
  
      await salesExecutive.save();
  
      res.status(200).json({
        success: true,
        message: 'SalesExecutive updated successfully',
        data: salesExecutive,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update salesExecutive',
        error: error.message,
      });
    }
  });


  const deleteSalesExecutive = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      const salesExecutive = await SalesExecutiveModel.findByIdAndDelete(id);
  
      if (!salesExecutive) {
        return res.status(404).json({
          success: false,
          message: 'SalesExecutive not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'SalesExecutive deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete salesExecutive',
        error: error.message,
      });
    }
  });

  const getAllSalesExecutive = asyncHandler(async (req, res) => {
    try {
      const telecallers = await SalesExecutiveModel.find();
  
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
  

module.exports = { addSalesExecutive, editSalesExecutive, deleteSalesExecutive, getAllSalesExecutive };
