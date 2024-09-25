const asyncHandler = require('express-async-handler');
const LeadModel = require('../models/LeadModel');
const BusinessAssociatesModel = require('../models/BusinessAssociatesModel');



const AddLead = asyncHandler(async (req, res) => {
  console.log(req.body)
  try {
    const {
      name,
      mobileNumber,
      alternateMobileNumber,
      email,
      loanType,
      businessAssociate,  // Assuming this is the ID of the business associate
      referralName,
      lastAppliedBank,
      lastRejectionReason
    } = req.body;

    // Check if required fields are provided
    if (!name || !mobileNumber || !loanType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create a new lead
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

    // Save the new lead
    const savedLead = await newLead.save();

    // If businessAssociate is provided, update the BusinessAssociate model
    if (businessAssociate) {
      const associatedBusiness = await BusinessAssociatesModel.findById(businessAssociate);

      if (!associatedBusiness) {
        return res.status(404).json({ message: 'Business associate not found' });
      }

      // Add the saved lead's ID to the leads array in BusinessAssociate model
      associatedBusiness.leads.push(savedLead._id);
      await associatedBusiness.save();
    }

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

    const allLeads = await LeadModel.find().populate('loanType').populate('businessAssociate')
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

  const GetSingleLead = asyncHandler(async (req, res) => {
    try {
      const {id} = req.params
    const singleLead = await LeadModel.findById(id).populate('loanType').populate('businessAssociate')
       res.status(201).json({
        message: 'Lead added successfully',
        data: singleLead
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to get Lead',
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

  const getLeadsByBusinessAssociate = asyncHandler(async (req, res) => {
    const { businessAssociateId } = req.params;
  
    try {
      // Find all leads that match the given business associate ID
      const leads = await LeadModel.find({ businessAssociate: businessAssociateId }).populate('loanType businessAssociate callRecords meetingRecords');
  
      if (leads.length === 0) {
        return res.status(404).json({ message: 'No leads found for this business associate' });
      }
  
      res.status(200).json({
        message: 'Leads fetched successfully',
        data: leads,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch leads',
        error: error.message,
      });
    }
  });

  const getPendingLeadsByBusinessAssociate = asyncHandler(async (req, res) => {
    const { businessAssociateId } = req.params;
  
    try {
      // Find all pending leads for the given business associate ID
      const pendingLeads = await LeadModel.find({
        status: 'pending',
        businessAssociate: businessAssociateId
      }).populate('loanType businessAssociate callRecords meetingRecords');
  
      if (!pendingLeads.length) {
        return res.status(404).json({ message: 'No pending leads found for this business associate' });
      }
  
      res.status(200).json({
        message: 'Pending leads fetched successfully',
        data: pendingLeads
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch pending leads',
        error: error.message
      });
    }
  });

  const getRejectedLeadsByBusinessAssociate = asyncHandler(async (req, res) => {
    const { businessAssociateId } = req.params;
  
    try {
      // Find all pending leads for the given business associate ID
      const rejectedLeads = await LeadModel.find({
        status: 'rejected',
        businessAssociate: businessAssociateId
      }).populate('loanType businessAssociate callRecords meetingRecords');
  
      if (!rejectedLeads.length) {
        return res.status(404).json({ message: 'No rejected leads found for this business associate' });
      }
  
      res.status(200).json({
        message: 'Rejected leads fetched successfully',
        data: rejectedLeads
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch rejected leads',
        error: error.message
      });
    }
  });

  const getSanctionedLeadsByBusinessAssociate = asyncHandler(async (req, res) => {
    const { businessAssociateId } = req.params;
  
    try {
      // Find all pending leads for the given business associate ID
      const sanctionedLeads = await LeadModel.find({
        status: 'sanctioned',
        businessAssociate: businessAssociateId
      }).populate('loanType businessAssociate callRecords meetingRecords');
  
      if (!sanctionedLeads.length) {
        return res.status(404).json({ message: 'No sanctioned leads found for this business associate' });
      }
  
      res.status(200).json({
        message: 'sanctioned leads fetched successfully',
        data: sanctionedLeads
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch sanctioned leads',
        error: error.message
      });
    }
  });
  
  


module.exports = {AddLead,GetAllLead,EditLead,DeleteLead,GetSingleLead,getLeadsByBusinessAssociate,getPendingLeadsByBusinessAssociate,getRejectedLeadsByBusinessAssociate,getSanctionedLeadsByBusinessAssociate}