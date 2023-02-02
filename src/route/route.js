const express = require('express')
const router = express.Router()
const {registerUser,loginUser,getUserByParams} = require("../controller/userController")
const {authentication} = require("../middlewares/auth")


router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authentication,getUserByParams)

module.exports = router