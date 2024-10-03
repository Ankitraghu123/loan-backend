const express = require('express');
const { addManager, editManager, deleteManager, getAllManagers } = require('../controllers/ManagerControllers');
const { isAdmin } = require('../middlewares/authMiddlewares');
const router = express.Router();

// Routes for Manager
router.post('/add',isAdmin, addManager); // Add Manager
router.put('/:id',isAdmin, editManager); // Edit Manager
router.delete('/:id',isAdmin, deleteManager); // Delete Manager
router.get('/all',isAdmin, getAllManagers); // Show all Managers

module.exports = router;