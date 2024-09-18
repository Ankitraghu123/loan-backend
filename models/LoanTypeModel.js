const mongoose = require('mongoose')

const LoanSchema = new mongoose.Schema({
    loanName: {
        type: String,
      },
  }, {
    timestamps: true
  });

const LoanTypeModel = mongoose.model('LoanType', LoanSchema);

module.exports = LoanTypeModel;