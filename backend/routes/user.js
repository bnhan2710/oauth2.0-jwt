const router =  require('express').Router();
const userController = require('../controllers/userControllers')

//GET ALl USESRS
router.get('/', userController.getAllUsers)

//DELETE USER
router.delete('/:id',userController.deleteUser)

module.exports = router;
