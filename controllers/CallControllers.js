const asyncHandler = require('express-async-handler');

const LeadModel = require('../models/LeadModel');
const CallRecordModel = require('../models/CallModel');


const AddCallRecord = asyncHandler(async (req, res) => {
  try {
    const {
      customName,
      lead,
      mobileNumber,
      remark,
      nextCallDate,
      empId,
      isImportant
    } = req.body;

    if (!customName || !mobileNumber || !lead) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newCallRecord = new CallRecordModel({
      customName,
      lead,
      mobileNumber,
      remark,
      nextCallDate,
      empId,
      isImportant
    });

    const savedCallRecord = await newCallRecord.save();

    const updatedLead = await LeadModel.findByIdAndUpdate(
        lead,
        { $push: { callRecords: savedCallRecord._id } },
        { new: true, runValidators: true }
      );
  
      if (!updatedLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }

    res.status(201).json({
      message: 'Call record added successfully',
      data: savedCallRecord
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to add call record',
      error: error.message
    });
  }
});


const GetAllCallRecord = asyncHandler(async (req, res) => {
    try {
     const allCallRecords = await CallRecordModel.find()
  
      res.status(201).json({
        message: 'Call records',
        data: allCallRecords
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to Get call record',
        error: error.message
      });
    }
  });

  const GetCallRecordsByLead = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find all call records that match the specified lead ID
      const callRecords = await CallRecordModel.find({ lead: id });
  
      if (!callRecords || callRecords.length === 0) {
        return res.status(404).json({ message: 'No call records found for this lead' });
      }
  
      res.status(200).json({
        message: 'Call records retrieved successfully',
        data: callRecords
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve call records',
        error: error.message
      });
    }
  });


  const getTodayCallRecords = async (req, res) => {
    try {
      // Get today's date (year, month, and day only)
      const today = moment().startOf('day').toDate(); // Start of today (ignoring time)
      
      // Query to find records where the year, month, and day match today's date
      const todayCallRecords = await CallRecordModel.find({
        nextCallDate: {
          $gte: today,
          $lt: moment(today).add(1, 'day').toDate(), // Less than start of the next day
        },
      }).populate('lead'); // Populate lead details if needed
  
      // Send the found records in the response
      res.status(200).json({
        success: true,
        data: todayCallRecords,
      });
    } catch (error) {
      // Handle any errors
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve call records',
        error: error.message,
      });
    }
  };


module.exports = { AddCallRecord ,GetAllCallRecord,GetCallRecordsByLead,getTodayCallRecords};
