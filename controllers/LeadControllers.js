const asyncHandler = require('express-async-handler');
const LeadModel = require('../models/LeadModel');
const BusinessAssociatesModel = require('../models/BusinessAssociatesModel');
const LoanTypeModel = require('../models/LoanTypeModel')
const imageKit = require('../config/imageKit');
const LoanDocumnetsModel = require('../models/LoanDocumentsModel');

const AddLead = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      mobileNumber,
      alternateMobileNumber,
      email,
      loanType,
      loanPersonType,
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
      lastRejectionReason,
      loanPersonType
    });

    // Save the new lead
    const savedLead = await newLead.save();

    // Fetch the documents from LoanDocumentsModel based on the loan type and person type
    const loanTypeDocument = await LoanTypeModel.findById(loanType).select('loanName');
    if (!loanTypeDocument) {
      return res.status(404).json({ message: 'Loan type not found' });
    }

    console.log(loanTypeDocument)

    // Fetch the documents from LoanDocumentsModel based on the loan name and person type
    const clonedDocs = await LoanDocumnetsModel.find({
      loanType: loanTypeDocument.loanName,  // Use the loan name for filtering
      loanPersonType: loanPersonType
    });

    console.log(clonedDocs)


    // Transform the cloned documents to match the lead's docs structure
    const transformedDocs = clonedDocs.map(doc => ({
      name: doc.name,   // Only copy the name from LoanDocumentsModel
      file: '',         // No file initially (users will upload this later)
      status: 'pending' // Default status
    }));

    // Update the lead with cloned documents if any are found
    if (transformedDocs.length > 0) {
      savedLead.docs = transformedDocs;
      await savedLead.save();
    }

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
    const singleLead = await LeadModel.findById(id).populate('loanType').populate('businessAssociate').populate('docs')
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
  
      // Fetch the current lead
      const existingLead = await LeadModel.findById(id);
      if (!existingLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      // Update the lead
      const updatedLead = await LeadModel.findByIdAndUpdate(id, updateData, {
        new: true, 
        runValidators: true 
      });
  
      if (!updatedLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      // Check if loanType or loanPersonType has changed
      const loanTypeChanged = existingLead.loanType !== updatedLead.loanType;
      const loanPersonTypeChanged = existingLead.loanPersonType !== updatedLead.loanPersonType;
  
      if (loanTypeChanged || loanPersonTypeChanged) {
        console.log('hii')
        const loanTypeDocument = await LoanTypeModel.findById(updatedLead.loanType).select('loanName');
        if (!loanTypeDocument) {
          return res.status(404).json({ message: 'Loan type not found' });
        }
  
        // Fetch the documents from LoanDocumentsModel based on the new loan type and person type
        const clonedDocs = await LoanDocumnetsModel.find({
          loanType: loanTypeDocument.loanName,
          loanPersonType: updatedLead.loanPersonType
        });
  
        // Transform the cloned documents to match the lead's docs structure
        const transformedDocs = clonedDocs.map(doc => ({
          name: doc.name, 
          file: '',         
          status: 'pending' 
        }));
  
        // Update the lead with cloned documents if any are found
        if (transformedDocs.length > 0) {
          updatedLead.docs = transformedDocs;
          await updatedLead.save();
        }
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
  

  // const EditLead = asyncHandler(async (req, res) => {
  //   try {
  //     const { id } = req.params; 
  //     const updateData = req.body; 
  
  //     const updatedLead = await LeadModel.findByIdAndUpdate(id, updateData, {
  //       new: true, 
  //       runValidators: true 
  //     });
  
  //     if (!updatedLead) {
  //       return res.status(404).json({ message: 'Lead not found' });
  //     }
  
  //     res.status(200).json({
  //       message: 'Lead updated successfully',
  //       data: updatedLead
  //     });
  
  //   } catch (error) {
  //     res.status(500).json({
  //       message: 'Failed to update lead',
  //       error: error.message
  //     });
  //   }
  // });


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


  const uploadDoc = asyncHandler (async (req, res) => {
    try {
        const { leadId } = req.body;  // leadId in request body
      console.log(req.body)
        // Validate leadId
        if (!leadId) {
            return res.status(400).json({ message: 'Lead ID is required' });
        }
  
        const { docId } = req.body;  // docId inside form data
        if (!docId) {
            return res.status(400).json({ message: 'Document ID is required' });
        }
  
        // Check if file is present
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
  
        const file = req.files.file;
  
        // Upload the file to ImageKit
        const uploadResponse = await imageKit.upload({
            file: file.data,         // File buffer
            fileName: file.name,     // Original file name
            folder: "/lead-documents", // Folder in ImageKit
        });
  
        // Find the lead by leadId
        const lead = await LeadModel.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
  
        // Find the specific document by docId in the docs array
        const docIndex = lead.docs.findIndex(doc => doc._id.toString() === docId);
        if (docIndex === -1) {
            return res.status(404).json({ message: 'Document not found in lead' });
        }
  
        // Update the document with the uploaded file URL and mark it as completed
        lead.docs[docIndex].file = uploadResponse.url; // URL from ImageKit
        lead.docs[docIndex].status = 'submitted';
        lead.docs[docIndex].date = new Date();  
  
        // Save the updated lead with the new document info
        await lead.save();
  
        res.status(200).json({
            message: 'Document uploaded and updated successfully',
            fileUrl: uploadResponse.url, // URL of the uploaded document
            lead
        });
    } catch (error) {
        res.status(500).json({
            message: 'File upload failed',
            error: error.message
        });
    }
  });
  


  const editDoc = asyncHandler(async (req, res) => {
    try {
      const { leadId, docId } = req.body; // leadId and docId in request body
  
      // Validate leadId and docId
      if (!leadId || !docId) {
        return res.status(400).json({ message: 'Lead ID and Document ID are required' });
      }
  
      // Check if file is present in the request
      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded for the document' });
      }
  
      const file = req.files.file; // The new file to upload
  
      // Upload the new file to ImageKit
      const uploadResponse = await imageKit.upload({
        file: file.data,         // File buffer
        fileName: file.name,     // Original file name
        folder: "/lead-documents", // Folder in ImageKit
      });
  
      // Find the lead by leadId
      const lead = await LeadModel.findById(leadId);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      // Find the specific document by docId in the docs array
      const docIndex = lead.docs.findIndex(doc => doc._id.toString() === docId);
      if (docIndex === -1) {
        return res.status(404).json({ message: 'Document not found in lead' });
      }
  
      // Update the document's file URL and mark it as submitted
      lead.docs[docIndex].file = uploadResponse.url; // New file URL from ImageKit
      lead.docs[docIndex].status = 'submitted'; // Update status if needed
  
      // Save the updated lead with the new document info
      await lead.save();
  
      res.status(200).json({
        message: 'Document file updated successfully',
        fileUrl: uploadResponse.url, // URL of the new uploaded document
        lead
      });
    } catch (error) {
      res.status(500).json({
        message: 'Document update failed',
        error: error.message
      });
    }
  });

  const deleteDoc = asyncHandler(async (req, res) => {
    try {
      console.log(req.body)
      const { leadId, docId } = req.body; // leadId and docId in request body
  
      // Validate leadId and docId
      if (!leadId || !docId) {
        return res.status(400).json({ message: 'Lead ID and Document ID are required' });
      }
  
      // Find the lead by leadId
      const lead = await LeadModel.findById(leadId);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      // Find the specific document by docId in the docs array
      const docIndex = lead.docs.findIndex(doc => doc._id.toString() === docId);
      if (docIndex === -1) {
        return res.status(404).json({ message: 'Document not found in lead' });
      }
  
      // Clear the file URL and update the document's status
      lead.docs[docIndex].file = null; // Clear the file URL
      lead.docs[docIndex].status = 'pending'; // Change status
  
      // Save the updated lead
      await lead.save();
  
      res.status(200).json({
        message: 'Document file deleted successfully',
        lead
      });
    } catch (error) {
      res.status(500).json({
        message: 'Document deletion failed',
        error: error.message
      });
    }
  });
  
  
  
  


module.exports = {AddLead,GetAllLead,EditLead,DeleteLead,GetSingleLead,getLeadsByBusinessAssociate,getPendingLeadsByBusinessAssociate,getRejectedLeadsByBusinessAssociate,getSanctionedLeadsByBusinessAssociate,uploadDoc,editDoc,deleteDoc}