const express = require('express')
const { isAdmin } = require('../middlewares/authMiddlewares')
const { AddFileStages, deleteFileStages, editFileStages, allFileStages, updateLeadFileStage } = require('../controllers/FileStagesControllers')

const router = express.Router()

router.post('/add',isAdmin,AddFileStages)


router.delete('/:id',isAdmin,deleteFileStages)

router.put('/:id',isAdmin,editFileStages)

router.get('/all',isAdmin,allFileStages)

router.put('/update/lead',isAdmin,updateLeadFileStage)





module.exports = router