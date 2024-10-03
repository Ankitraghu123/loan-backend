const mongoose = require('mongoose');

// Define SalesExecutive Schema
const SalesExecutiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  mobile: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'salesExecutive', 
  },
}, {
  timestamps: true, 
});

const SalesExecutiveModel = mongoose.model('SalesExecutive', SalesExecutiveSchema);

module.exports = SalesExecutiveModel;
