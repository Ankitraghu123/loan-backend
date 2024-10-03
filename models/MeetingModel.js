const mongoose = require('mongoose');

// Define MeetingRecord Schema
const MeetingRecordSchema = new mongoose.Schema({
  customName: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lead',
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
    required: false,
    trim: true
  },
  nextMeetingDate: {
    type: Date, 
    required: false,
  },
  empId: {
    type:String
    // type: mongoose.Schema.Types.ObjectId, 
    // ref: 'Employee',
    // required: true
  },
  meetingDate: {
    type: Date,
    default: Date.now, 
    required: true
  },
  isImportant:{
    type:Boolean
  }
}, {
  timestamps: true
});

// Create and export MeetingRecord model
const MeetingRecordModel = mongoose.model('MeetingRecord', MeetingRecordSchema);

module.exports = MeetingRecordModel;
