const userModel = require("../model/userModel")
const mongoose = require("mongoose")
const validator = require("../validator/validator")

const {uploadFile} = require("../MiddleWares/aws")
const valid = require("validator")
const bcrypt = require("bcryptjs")
 



//module.exports = { updateUser }