const express = require('express')
const { AddMeetingRecord, GetAllMeetingRecords, GetMeetingRecordsByLead } = require('../controllers/MeetingControllers')
const router = express.Router()

router.post('/addMeeting',AddMeetingRecord)

router.get('/all',GetAllMeetingRecords)

router.get('/all/:id',GetMeetingRecordsByLead)

module.exports = router