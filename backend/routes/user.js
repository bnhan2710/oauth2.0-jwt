const router =  require('express').Router();
const userController = require('../controllers/userControllers')
const middlewareController = require('../middleware/middlewareController')

//GET ALl USESRS
router.get('/',middlewareController.verifyToken, userController.getAllUsers)

//DELETE USER
router.delete('/:id',middlewareController.AdminAuth,userController.deleteUser)

module.exports = router;
