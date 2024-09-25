const mongoose = require('mongoose')
const bcrypt =require('bcrypt')

const AdminSchema = new mongoose.Schema({
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
      password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
      },
      role:{
        type:String,
        default:"admin"
      }
  }, {
    timestamps: true
  });

  AdminSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  AdminSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

const AdminModel = mongoose.model('Admin', AdminSchema);

module.exports = AdminModel;