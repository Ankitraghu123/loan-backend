const asyncHandler = require('express-async-handler')
const BusinessAssociatesModel = require('../models/BusinessAssociatesModel');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');


const Register = asyncHandler( async(req,res)=>{
  try{
   const newBusinessAssociate = await BusinessAssociatesModel.create(req.body)
   const token = generateToken(newBusinessAssociate._id);

   res.status(201).json({ newBusinessAssociate, token });
  }catch(error){
   res.status(500).json({ message: 'Registration failed', error: error.message });
  }
  
})

const Login = asyncHandler(async(req,res)=>{
  try{
      const {email,password} = req.body
      const findBusinessAssociate = await BusinessAssociatesModel.findOne({email})
      if(findBusinessAssociate && await findBusinessAssociate.isPasswordMatched(password)){
          const refreshToken = await generateRefreshToken(findBusinessAssociate._id)
          const updateBusinessAssociate = await BusinessAssociatesModel.findOneAndUpdate(findBusinessAssociate._id,{refreshToken},{new:true})
          res.cookie('refreshToken',refreshToken,{
              httpOnly:true,
              maxAge : 72 * 60 * 60 * 1000
          })
          res.json({
              _id:findBusinessAssociate._id,
              name:findBusinessAssociate.name,
              email:findBusinessAssociate.email,
              token:generateToken(findBusinessAssociate._id)
          })
      }else{
          throw new Error('Invalid credientials')
      }
  }catch(error){
      res.status(500).json({ message: 'Login failed', error: error.message });
  }
})


const allBusinessAssociatess = asyncHandler( async(req,res)=>{
    try{
      const allBusinessociates = await BusinessAssociatesModel.find()
      res.status(200).json(allBusinessociates)
    }catch(error){
      res.status(500).json({ message: 'failed in getting all Businessociatess', error: error.message })
    }
     
  })

  const deleteBusinessociates = asyncHandler( async(req,res)=>{
    try{
    const {id} = req.params
      const deletedBusinessociates = await BusinessAssociatesModel.findByIdAndDelete(id)
      res.status(200).json(deletedBusinessociates)
    }catch(error){
      res.status(500).json({ message: 'Unable to delete Businessociates', error: error.message })
    }
     
  })

  const editBusinessociates = asyncHandler( async(req,res)=>{
    try{
    const {id} = req.params
      await BusinessAssociatesModel.findByIdAndUpdate(id,req.body)
      res.status(200).json("Businessociates edited")
    }catch(error){
      res.status(500).json({ message: 'Unable to edit Businessociates', error: error.message })
    }
     
  })




module.exports = {Register,Login,allBusinessAssociatess,deleteBusinessociates,editBusinessociates}