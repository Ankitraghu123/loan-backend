const asyncHandler = require('express-async-handler')
const FileStagesModel = require('../models/FileStagesModel')
const LeadModel = require('../models/LeadModel')


const AddFileStages = asyncHandler( async(req,res)=>{
  try{
    console.log(req.body)
    const newFileStages = await FileStagesModel.create(req.body)
    res.status(200).json(newFileStages)
  }catch(error){
    res.status(500).json({ message: 'add loan type failed', error: error.message })
  }
   
})


  const deleteFileStages = asyncHandler( async(req,res)=>{
    try{
    const {id} = req.params
      const deletedFileStage = await FileStagesModel.findByIdAndDelete(id)
      res.status(200).json(deletedFileStage)
    }catch(error){
      res.status(500).json({ message: 'Unable to delete loan', error: error.message })
    }
     
  })

  const editFileStages = asyncHandler( async(req,res)=>{
    try{
    const {id} = req.params
     const editedFileStage =  await FileStagesModel.findByIdAndUpdate(id,req.body)
      res.status(200).json(editedFileStage)
    }catch(error){
      res.status(500).json({ message: 'Unable to edit loan', error: error.message })
    }
     
  })

  const allFileStages = asyncHandler( async(req,res)=>{
    try{
      const allFileStages = await FileStagesModel.find()
      res.status(200).json(allFileStages)
    }catch(error){
      res.status(500).json({ message: 'failed in getting all docs', error: error.message })
    }
     
  })


    // file stages controllers  on the basis of lead
    const updateLeadFileStage = asyncHandler(async (req, res) => {
        const { status, remark, leadId, fileStageId } = req.body;
      
        try {
          const lead = await LeadModel.findById(leadId);
          if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
          }
      
          const fileStage = lead.fileStages.id(fileStageId);
          if (fileStage.status === 'pending' ) {
            fileStage.date = Date.now(); 
          }
      
          if (!fileStage) {
            return res.status(404).json({ message: 'File stage not found' });
          }
          if (status && fileStage.status !== status) {
            fileStage.status = status;
          }
      
          if (remark) {
            fileStage.remark = remark;
          }

          await lead.save();
      
          res.status(200).json({ message: 'File stage updated successfully', lead });
        } catch (error) {
          res.status(500).json({ message: 'Error updating file stage', error: error.message });
        }
      });




module.exports = {AddFileStages,editFileStages,deleteFileStages,allFileStages,updateLeadFileStage}