const authControllers = require('../controllers/authControllers')
const passwordControllers = require('../controllers/passwordControllers')
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
router.post('/reset-password',passwordControllers.resetPassword)

module.exports = router