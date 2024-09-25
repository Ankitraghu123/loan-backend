const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const BusinessAssociatesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], 
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'], 
  },
  email: {
    type: String,
    // required: [true, 'Email is required'], 
    trim: true,
    unique: true,
    match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address"
    ],
  },
  leads:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Lead'
  }],
  password:{
    type: String,
    // required: [true, "Password is required"],
    // minlength: [6, "Password must be at least 6 characters long"],
  },
  role:{
    type:String,
    default:"associate"
  },
  mobile:{
    type:Number,
    unique:true,
  },
  currentDesignation:{
    type:String
  },
  currentBank:{
    type:String
  },
  location:{
    type:String
  }
}, {
timestamps: true
});

BusinessAssociatesSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
      next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

BusinessAssociatesSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const BusinessAssociatesModel = mongoose.model('BusinessAssociates', BusinessAssociatesSchema);

module.exports = BusinessAssociatesModel;