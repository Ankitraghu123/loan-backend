const { generateToken } = require('../config/jwtToken')
const asyncHandler = require('express-async-handler')
const {generateRefreshToken} = require('../config/refreshToken')
const AdminModel = require('../models/AdminModel')
const BusinessAssociatesModel = require('../models/BusinessAssociatesModel')
const TelecallerModel = require('../models/TelecallerModel')
const ManagerModel = require('../models/ManagerModel')
const SalesExecutiveModel = require('../models/SalesExecutiveModel')

const Register = asyncHandler( async(req,res)=>{
   try{
    const newAdmin = await AdminModel.create(req.body)
    const token = generateToken(newAdmin._id);

    res.status(201).json({ newAdmin, token });
   }catch(error){
    res.status(500).json({ message: 'Registration failed', error: error.message });
   }
   
})

// const Login = asyncHandler(async(req,res)=>{
//     try{
//         const {email,password} = req.body
//         const findAdmin = await AdminModel.findOne({email})
//         if(findAdmin && await findAdmin.isPasswordMatched(password)){
//             const refreshToken = await generateRefreshToken(findAdmin._id)
//             const updateAdmin = await AdminModel.findOneAndUpdate(findAdmin._id,{refreshToken},{new:true})
//             res.cookie('refreshToken',refreshToken,{
//                 httpOnly:true,
//                 maxAge : 72 * 60 * 60 * 1000
//             })
//             res.json({
//                 _id:findAdmin._id,
//                 name:findAdmin.name,
//                 email:findAdmin.email,
//                 token:generateToken(findAdmin._id)
//             })
//         }else{
//             throw new Error('Invalid credientials')
//         }
//     }catch(error){
//         res.status(500).json({ message: 'Login failed', error: error.message });
//     }
// })

// const Login = asyncHandler(async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Try to find the user in the Admin model
//         let user = await AdminModel.findOne({ email });

//         // If not found in Admin model, check in Business Associate model
//         if (!user) {
//             user = await BusinessAssociatesModel.findOne({ email });
//         }

//         // If user is found in either schema, verify the password
//         if (user && await user.isPasswordMatched(password)) {
//             const refreshToken = await generateRefreshToken(user._id);

//             // Update the refresh token in the corresponding schema
//             if (user instanceof AdminModel) {
//                 await AdminModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
//             } else if (user instanceof BusinessAssociatesModel) {
//                 await BusinessAssociatesModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
//             }

//             // Set the refresh token in a cookie
//             res.cookie('refreshToken', refreshToken, {
//                 httpOnly: true,
//                 maxAge: 72 * 60 * 60 * 1000 // 3 days
//             });

//             // Respond with user details and access token
//             res.json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user instanceof AdminModel ? 'admin' : 'business-associate',
//                 token: generateToken(user._id)
//             });
//         } else {
//             throw new Error('Invalid credentials');
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Login failed', error: error.message });
//     }
// });


const Login = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
  
      let user = null;
      let role = null;
  
      // Try to find the user in different models
      user = await AdminModel.findOne({ email });
      if (user) role = 'admin';
  
      if (!user) {
        user = await BusinessAssociatesModel.findOne({ email });
        if (user) role = 'associate';
      }
  
      if (!user) {
        user = await TelecallerModel.findOne({ email });
        if (user) role = 'telecaller';
      }
  
      if (!user) {
        user = await ManagerModel.findOne({ email });
        if (user) role = 'manager';
      }
  
      if (!user) {
        user = await SalesExecutiveModel.findOne({ email });
        if (user) role = 'salesExecutive';
      }
  
      // Check if user exists
      if (!user) {
        throw new Error('Invalid credentials');
      }
  
      // If the user is an admin or business associate (hashed password)
      if (role === 'admin' || role === 'associate') {
        const isPasswordValid = await user.isPasswordMatched(password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }
      } else {
        // For plain-text password users (telecaller, manager, sales-executive)
        if (user.password !== password) {
          throw new Error('Invalid credentials');
        }
      }
  
      // Generate refresh token and update user
      const refreshToken = await generateRefreshToken(user._id);
      if (role === 'admin') {
        await AdminModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
      } else if (role === 'associate') {
        await BusinessAssociatesModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
      } else if (role === 'telecaller') {
        await TelecallerModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
      } else if (role === 'manager') {
        await ManagerModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
      } else if (role === 'salesExecutive') {
        await SalesExecutiveModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
      }
  
      // Set refresh token in cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000 // 3 days
      });
  
      // Respond with user details and access token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        token: generateToken(user._id)
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });
  


module.exports = {Register,Login}