const { generateToken } = require('../config/jwtToken')
const asyncHandler = require('express-async-handler')
const {generateRefreshToken} = require('../config/refreshToken')
const AdminModel = require('../models/AdminModel')

const Register = asyncHandler( async(req,res)=>{
   try{
    const newAdmin = await AdminModel.create(req.body)
    const token = generateToken(newAdmin._id);

    res.status(201).json({ newAdmin, token });
   }catch(error){
    res.status(500).json({ message: 'Registration failed', error: error.message });
   }
   
})

const Login = asyncHandler(async(req,res)=>{
    try{
        const {email,password} = req.body
        const findAdmin = await AdminModel.findOne({email})
        if(findAdmin && await findAdmin.isPasswordMatched(password)){
            const refreshToken = await generateRefreshToken(findAdmin._id)
            const updateAdmin = await AdminModel.findOneAndUpdate(findAdmin._id,{refreshToken},{new:true})
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                maxAge : 72 * 60 * 60 * 1000
            })
            res.json({
                _id:findAdmin._id,
                name:findAdmin.name,
                email:findAdmin.email,
                token:generateToken(findAdmin._id)
            })
        }else{
            throw new Error('Invalid credientials')
        }
    }catch(error){
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
})


module.exports = {Register,Login}