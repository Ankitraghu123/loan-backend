const asyncHandler = require('express-async-handler');
const LeadModel = require('../models/LeadModel');
const MeetingRecordModel = require('../models/MeetingModel'); // Adjust the path to your MeetingModel

const AddMeetingRecord = asyncHandler(async (req, res) => {
  try {
    const {
      customName,
      lead,
      mobileNumber,
      remark,
      nextMeetingDate,
      empId,
      isImportant
    } = req.body;

    if (!customName || !mobileNumber || !lead) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create a new MeetingRecord instance
    const newMeetingRecord = new MeetingRecordModel({
      customName,
      lead,
      mobileNumber,
      remark,
      nextMeetingDate,
      empId,
      isImportant
    });

    // Save the meeting record to the database
    const savedMeetingRecord = await newMeetingRecord.save();

    // Update the corresponding Lead document with the new MeetingRecord ID
    const updatedLead = await LeadModel.findByIdAndUpdate(
      lead,
      { $push: { meetingRecords: savedMeetingRecord._id } },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.status(201).json({
      message: 'Meeting record added successfully',
      data: savedMeetingRecord
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to add meeting record',
      error: error.message
    });
  }
});


const GetAllMeetingRecords = asyncHandler(async (req, res) => {
    try {
     const allMeetings = await MeetingRecordModel.find()
  
      res.status(201).json({
        message: 'Meeting record added successfully',
        data: allMeetings
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to add meeting record',
        error: error.message
      });
    }
  });


  const GetMeetingRecordsByLead = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find all meeting records that match the specified lead ID
      const meetingRecords = await MeetingRecordModel.find({ lead: id });
  
      if (!meetingRecords || meetingRecords.length === 0) {
        return res.status(404).json({ message: 'No meeting records found for this lead' });
      }
  
      res.status(200).json({
        message: 'Meeting records retrieved successfully',
        data: meetingRecords
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve meeting records',
        error: error.message
      });
    }
  });

module.exports = { AddMeetingRecord ,GetAllMeetingRecords,GetMeetingRecordsByLead};
