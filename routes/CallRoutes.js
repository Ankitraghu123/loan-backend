const express = require('express')
const { AddCallRecord, GetAllCallRecord, GetCallRecordsByLead, getTodayCallRecords } = require('../controllers/CallControllers')
const router = express.Router()

router.post('/addCall',AddCallRecord)

router.get('/all',GetAllCallRecord)

router.get('/all/:id',GetCallRecordsByLead)

router.get('/all/today',getTodayCallRecords)


module.exports = router