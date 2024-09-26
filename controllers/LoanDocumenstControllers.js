const asyncHandler = require('express-async-handler')
const LoanDocumnetsModel = require('../models/LoanDocumentsModel')


const AddLoanDoc = asyncHandler( async(req,res)=>{
  try{
    console.log(req.body)
    const newLoanDoc = await LoanDocumnetsModel.create(req.body)
    res.status(200).json(newLoanDoc)
  }catch(error){
    res.status(500).json({ message: 'add loan type failed', error: error.message })
  }
   
})


  const deleteLoanDoc = asyncHandler( async(req,res)=>{
    try{
    const {id} = req.params
      const deletedLoan = await LoanDocumnetsModel.findByIdAndDelete(id)
      res.status(200).json(deletedLoan)
    }catch(error){
      res.status(500).json({ message: 'Unable to delete loan', error: error.message })
    }
     
  })

  const editLoanDoc = asyncHandler( async(req,res)=>{
    try{
    const {id} = req.params
     const editedLoan =  await LoanDocumnetsModel.findByIdAndUpdate(id,req.body)
      res.status(200).json(editedLoan)
    }catch(error){
      res.status(500).json({ message: 'Unable to edit loan', error: error.message })
    }
     
  })

  const allDocuments = asyncHandler( async(req,res)=>{
    try{
      const allDocs = await LoanDocumnetsModel.find()
      res.status(200).json(allDocs)
    }catch(error){
      res.status(500).json({ message: 'failed in getting all docs', error: error.message })
    }
     
  })




module.exports = {AddLoanDoc,deleteLoanDoc,editLoanDoc,allDocuments}