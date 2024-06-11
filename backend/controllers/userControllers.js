const User = require('../models/User')

const userController = {
    // GET ALL USERS
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);     
        } catch (err) {
            res.status(500).json(err);       
        }
    },
    //DELETE USER
    deleteUser : async(req,res) => {
        try{
            const user = await User.findByIdAndDelete(req.param.id)
            res.status(200).json("Delete succesfully!")
        }catch(err){
            res.status(500).json(err);
        }
    }
}

module.exports = userController;
