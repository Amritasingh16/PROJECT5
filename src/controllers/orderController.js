const orderModel = require("../models/orderModel")
const cartModel= require("../models/cartModel")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const userModel = require("../models/userModel")
const productModel= require("../models/productModel")

const createOrder = async function (req, res) {
    let data = req.body
    let userId = req.params.userId
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide some data in body" })
    if(!mongoose.isValidObjectId(userId)) return res.status(400).send({status:false, message: "INVALID userId"})
    let findUser = await userModel.findOne({ _id: userId })
    let createData = await orderModel.create(data)
    return res.status(201).send({ status: true, message: "Success", data: createData })
} 

const updateOrder=async function (req,res){





}




module.exports={createOrder,updateOrder}