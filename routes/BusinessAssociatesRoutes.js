const express = require('express')
const {  allBusinessAssociatess, deleteBusinessociates, editBusinessociates, Register, Login } = require('../controllers/BusinessAssociatesControllers')
const {isAdmin } = require('../middlewares/authMiddlewares')

const router = express.Router()


router.post('/register',isAdmin,Register)

router.post('/login',Login)


router.get('/all',isAdmin,allBusinessAssociatess)

router.delete('/:id',isAdmin,deleteBusinessociates)

router.put('/:id',isAdmin,editBusinessociates)

module.exports = router