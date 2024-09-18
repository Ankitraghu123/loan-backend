const asyncHandler = require('express-async-handler')
const BusinessAssociatesModel = require('../models/BusinessAssociatesModel')


const AddBusinessAssociates = asyncHandler( async(req,res)=>{
  try{
    const newBusinessociates = await BusinessAssociatesModel.create(req.body)
    res.status(200).json(newBusinessociates)
  }catch(error){
    res.status(500).json({ message: 'add Businessociates type failed', error: error.message })
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




module.exports = {AddBusinessAssociates,allBusinessAssociatess,deleteBusinessociates,editBusinessociates}