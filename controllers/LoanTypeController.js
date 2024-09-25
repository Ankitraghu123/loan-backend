const asyncHandler = require('express-async-handler')
const LoanTypeModel = require('../models/LoanTypeModel')


const AddLoanType = asyncHandler( async(req,res)=>{
  try{
    const newLoan = await LoanTypeModel.create(req.body)
    res.status(200).json(newLoan)
  }catch(error){
    res.status(500).json({ message: 'add loan type failed', error: error.message })
  }
   
})

const allLoanTypes = asyncHandler( async(req,res)=>{
    try{
      const allLoans = await LoanTypeModel.find()
      res.status(200).json(allLoans)
    }catch(error){
      res.status(500).json({ message: 'failed in getting all loans', error: error.message })
    }
     
  })

  const deleteLoan = asyncHandler( async(req,res)=>{
    try{
    const {id} = req.params
      const deletedLoan = await LoanTypeModel.findByIdAndDelete(id)
      res.status(200).json(deletedLoan)
    }catch(error){
      res.status(500).json({ message: 'Unable to delete loan', error: error.message })
    }
     
  })

  const editLoan = asyncHandler( async(req,res)=>{
    try{
    const {id} = req.params
     const editedLoan =  await LoanTypeModel.findByIdAndUpdate(id,req.body)
      res.status(200).json(editedLoan)
    }catch(error){
      res.status(500).json({ message: 'Unable to edit loan', error: error.message })
    }
     
  })




module.exports = {AddLoanType,allLoanTypes,deleteLoan,editLoan}