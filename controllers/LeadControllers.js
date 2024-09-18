const asyncHandler = require('express-async-handler');
const LeadModel = require('../models/LeadModel');



const AddLead = asyncHandler(async (req, res) => {
    try {
      const {
        name,
        mobileNumber,
        alternateMobileNumber,
        email,
        loanType,
        businessAssociate,
        referralName,
        lastAppliedBank,
        lastRejectionReason
      } = req.body;
  
      if (!name || !mobileNumber || !loanType) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }
  
      const newLead = new LeadModel({
        name,
        mobileNumber,
        alternateMobileNumber,
        email,
        loanType,
        businessAssociate,
        referralName,
        lastAppliedBank,
        lastRejectionReason
      });
  
      const savedLead = await newLead.save();
  
      res.status(201).json({
        message: 'Lead added successfully',
        data: savedLead
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to add lead',
        error: error.message
      });
    }
  });

  const GetAllLead = asyncHandler(async (req, res) => {
    try {

    const allLeads = await LeadModel.find()
       res.status(201).json({
        message: 'Lead added successfully',
        data: allLeads
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to get Leads',
        error: error.message
      });
    }
  });

  const EditLead = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params; 
      const updateData = req.body; 
  
      const updatedLead = await LeadModel.findByIdAndUpdate(id, updateData, {
        new: true, 
        runValidators: true 
      });
  
      if (!updatedLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      res.status(200).json({
        message: 'Lead updated successfully',
        data: updatedLead
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update lead',
        error: error.message
      });
    }
  });


  const DeleteLead = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params; 
  
      const deletedLead = await LeadModel.findByIdAndDelete(id);
  
      if (!deletedLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      res.status(200).json({
        message: 'Lead deleted successfully',
        data: deletedLead
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete lead',
        error: error.message
      });
    }
  });
  


module.exports = {AddLead,GetAllLead,EditLead,DeleteLead}