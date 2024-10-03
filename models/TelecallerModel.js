const mongoose = require('mongoose');

// Define Telecaller Schema
const TelecallerSchema = new mongoose.Schema({
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
    default: 'telecaller', 
  },
}, {
  timestamps: true, 
});

const TelecallerModel = mongoose.model('Telecaller', TelecallerSchema);

module.exports = TelecallerModel;
