const express = require('express')
const { AddBusinessAssociates, allBusinessAssociatess, deleteBusinessociates, editBusinessociates } = require('../controllers/BusinessAssociatesControllers')

const router = express.Router()


router.post('/addBusinessAssociate',AddBusinessAssociates)

router.get('/all',allBusinessAssociatess)

router.delete('/:id',deleteBusinessociates)

router.put('/:id',editBusinessociates)

module.exports = router