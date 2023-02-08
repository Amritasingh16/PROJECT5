const orderModel = require("../models/orderModel")
const cartModel = require("../models/cartModel")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")

const createOrder = async function (req, res) {
    try{
    let usersId = req.params.userId

    let cartId = req.body.cartId

    if (Object.keys(cartId).length == 0) return res.status(400).send({ status: false, message: "Please provide some data in body" })

    if (!mongoose.isValidObjectId(usersId)) return res.status(400).send({ status: false, message: "userId is invalid" })

    if (!cartId) return res.status(400).send({ status: false, message: "Please enter Cartid in request body" })
    if (!mongoose.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "invalid cart id" })

    let checkUser = await userModel.findOne({ _id: usersId })
    if (!checkUser) return res.status(404).send({ status: false, message: "User not found with this user id" })

    //-----------------()---------------(AUTHORIZATION)----------------()-------------------------//
    if (usersId !== req.bearerToken) return res.status(403).send({ status: false, message: "You are not authorised" })
    //--------------------------------------------------------------------------------------------//
    let getCart = await cartModel.findOne({ _id: cartId, userId: usersId }).select({ _id: 0, __v: 0 }).lean()
    let findCart = getCart.items
    if(findCart.length == 0) return res.status(400).send({status : false, message : "Cart is empty. Please add items in cart"})
    if (!getCart) return res.status(404).send({ status: false, message: "Cart doesn't exist with this  cartId or userID" })

    let tQ = 0
    for (let i = 0; i < getCart.items.length; i++) {
        tQ = tQ + getCart.items[i].quantity
    }
    getCart.totalQuantity = tQ
    

    let createData = await orderModel.create(getCart)
    await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } })

    let { _id, userId, items, totalPrice, totalItems, totalQuantity, cancellable, status, createdAt, updatedAt } = createData

    return res.status(201).send({ status: true, message: "Success", data: { _id, userId, items, totalPrice, totalItems, totalQuantity, cancellable, status, createdAt, updatedAt } })
    }catch(err){
        return res.status(500).send({status : false, error : err.message})
    }
}

const updateOrder = async function (req, res) {





}




module.exports = { createOrder, updateOrder }