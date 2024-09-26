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
    type: String,
    unique:true,
    // required: [true, 'Mobile number is required'],
    trim: true,
    match: [
        /^[0-9]{10}$/,
        "Please enter a valid 10-digit mobile number"
    ],
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
  loanPersonType:{
    type: String,
    required:true,
    enum: ['selfEmployed', 'salaried'], 
  },
  businessAssociate: {
    // type:String
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
  }],
  status: {
    type: String,
    enum: ['pending','sanctioned','rejected'], 
    default: 'pending'
  },
  docs: [{
    name: String,    // Document name
    file: String,    // File URL
    status: {
      type: String,
      enum: ['pending', 'submitted'],
      default: 'pending',
    },
  }],

}, {
  timestamps: true
});

// LeadSchema.index({ mobileNumber: 1 }, { unique: true });

const LeadModel = mongoose.model('Lead', LeadSchema);

module.exports = LeadModel;
