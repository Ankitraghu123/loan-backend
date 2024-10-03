const express = require('express');

const { isAdmin } = require('../middlewares/authMiddlewares');
const { addSalesExecutive, editSalesExecutive, deleteSalesExecutive, getAllSalesExecutive } = require('../controllers/SalesExecutiveControllers');
const router = express.Router();

// Routes for telecaller
router.post('/add',isAdmin, addSalesExecutive); 
router.put('/:id',isAdmin, editSalesExecutive); 
router.delete('/:id',isAdmin, deleteSalesExecutive); 
router.get('/all',isAdmin, getAllSalesExecutive); 

module.exports = router;