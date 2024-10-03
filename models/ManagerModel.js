const mongoose = require('mongoose');

// Define Manager Schema
const ManagerSchema = new mongoose.Schema({
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
    default: 'manager', 
  },
}, {
  timestamps: true, 
});

const ManagerModel = mongoose.model('Manager', ManagerSchema);

module.exports = ManagerModel;
