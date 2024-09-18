const express = require('express')
const { AddCallRecord, GetAllCallRecord, GetCallRecordsByLead } = require('../controllers/CallControllers')
const router = express.Router()

router.post('/addCall',AddCallRecord)

router.get('/all',GetAllCallRecord)

router.get('/all/:id',GetCallRecordsByLead)

module.exports = router