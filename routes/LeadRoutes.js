const express = require('express')
const { AddLead, GetAllLead, EditLead, DeleteLead } = require('../controllers/LeadControllers')
const router = express.Router()

router.post('/addLead',AddLead)

router.get('/all',GetAllLead)

router.put('/:id',EditLead)

router.delete('/:id',DeleteLead)

module.exports = router