const express = require('express')
const { AddLead, GetAllLead, EditLead, DeleteLead, GetSingleLead, getLeadsByBusinessAssociate, getPendingLeadsByBusinessAssociate,  getRejectedLeadsByBusinessAssociate, uploadDoc, deleteDoc, editDoc, getAllRejectedLead } = require('../controllers/LeadControllers')
const {  isAdmin, isAssociate } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/addLead',isAssociate,AddLead)

router.post('/upload-doc',uploadDoc)

router.put('/edit-doc', isAdmin,editDoc);

router.delete('/delete-doc', deleteDoc);

router.get('/all',isAdmin, GetAllLead)

router.get('/all/rejected',isAdmin, getAllRejectedLead)


router.get('/:id',isAssociate,GetSingleLead)

router.put('/:id',EditLead)

router.delete('/:id',DeleteLead)

router.get('/:businessAssociateId/all',getLeadsByBusinessAssociate)

router.get('/:businessAssociateId/pending',getPendingLeadsByBusinessAssociate)

// router.get('/:businessAssociateId/sanctioned',getSanctionedLeadsByBusinessAssociate)

router.get('/:businessAssociateId/rejected',getRejectedLeadsByBusinessAssociate)


module.exports = router