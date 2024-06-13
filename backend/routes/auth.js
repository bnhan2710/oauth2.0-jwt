const authControllers = require('../controllers/authControllers')
const router = require('express').Router()
//REGISTER
router.post("/register",authControllers.registerUser)
//LOGIN
router.post("/login", authControllers.loginUser)
router.post('/refresh',authControllers.requestRefreshToken)
module.exports = router