const express = require('express')
const router = express.Router()
const {registerUser,loginUser,getUserByParams,updateUser} = require("../controller/userController")
const {authentication} = require("../middlewares/auth")


router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authentication,getUserByParams)
router.put("/user/:userId/profile",authentication,updateUser)



module.exports = router