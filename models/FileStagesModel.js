const mongoose = require('mongoose');

// Define CallRecord Schema
const FileStagesSchema = new mongoose.Schema({
  name:{
    type:String,
  },
  loanType:{
    type:String,
  },
  loanPersonType:{
    type:String
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  remark:{
    type:String,
  },
  sequence:{
    type:Number
  },
  date:{
    type:Date
  }
}, {
  timestamps: true
});

// Create and export CallRecord model
const FileStagesModel = mongoose.model('FileStagesModel', FileStagesSchema);

module.exports = FileStagesModel
;
