const mongoose = require('mongoose');

// Define CallRecord Schema
const loanDocuments = new mongoose.Schema({
  name:{
    type:String,
  },
  loanType:{
    type:String,
  },
  loanPersonType:{
    type:String
  }
}, {
  timestamps: true
});

// Create and export CallRecord model
const LoanDocumnetsModel = mongoose.model('LoanDocumentModel', loanDocuments);

module.exports = LoanDocumnetsModel
;
