const express = require('express')
const { AddLoanDoc, deleteLoanDoc, editLoanDoc, allDocuments } = require('../controllers/LoanDocumenstControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')

const router = express.Router()

router.post('/add',isAdmin,AddLoanDoc)


router.delete('/:id',isAdmin,deleteLoanDoc)

router.put('/:id',isAdmin,editLoanDoc)

router.get('/all',isAdmin,allDocuments)





module.exports = router