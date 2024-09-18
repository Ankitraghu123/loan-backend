const mongoose = require('mongoose');

// Define Lead Schema
const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  alternateMobileNumber: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address"
    ],
  },
  loanType: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LoanType',
    required: true
  },
  businessAssociate: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BusinessAssociates',
  },
  referralName: {
    type: String,
    enum: ['Yes', 'No'], 
    default: 'No'
  },
  lastAppliedBank: {
    type: String,
    required: false,
  },
  lastRejectionReason: {
    type: String,
    required: false,
  },
  callRecords: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CallRecord'
  }],
  meetingRecords: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MeetingRecord'
  }]
}, {
  timestamps: true
});

const LeadModel = mongoose.model('Lead', LeadSchema);

module.exports = LeadModel;
