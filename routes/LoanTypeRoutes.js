const express = require('express')
const { AddLoanType, allLoanTypes, deleteLoan, editLoan } = require('../controllers/LoanTypeController')

const router = express.Router()

router.post('/addLoan',AddLoanType)

router.get('/all',allLoanTypes)

router.delete('/:id',deleteLoan)

router.put('/:id',editLoan)




module.exports = router