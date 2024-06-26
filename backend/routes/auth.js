const authControllers = require('../controllers/authControllers')
const middlewareController = require('../middleware/middlewareController')

const router = require('express').Router()

//REGISTER
router.post("/register",authControllers.registerUser)

//LOGIN
router.post("/login", authControllers.loginUser)

//REFRESH TOKEN
router.post('/refresh',authControllers.requestRefreshToken)

//LOG OUT
router.post('/logout',middlewareController.verifyToken,authControllers.userLogout)

//RESET PASSWORD
router.post('/reset/:token',authControllers.resetPassword)

// FORFOT PASSWORD
router.post('/forgot', authControllers.forgotPassword);

module.exports = router