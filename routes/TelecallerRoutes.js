const express = require('express');
const { addTelecaller, editTelecaller, deleteTelecaller, getAllTelecallers } = require('../controllers/TeleControllers');
const { isAdmin } = require('../middlewares/authMiddlewares');
const router = express.Router();

// Routes for telecaller
router.post('/add',isAdmin, addTelecaller); // Add telecaller
router.put('/:id',isAdmin, editTelecaller); // Edit telecaller
router.delete('/:id',isAdmin, deleteTelecaller); // Delete telecaller
router.get('/all',isAdmin, getAllTelecallers); // Show all telecallers

module.exports = router;