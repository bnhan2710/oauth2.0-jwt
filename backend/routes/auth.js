const authControllers = require('../controllers/authControllers')

const router = require('express').Router()
//REGISTER
router.post("/register",authControllers.registersUser)
//LOGIN
router.post("/login", authControllers.loginUser)
module.exports = router