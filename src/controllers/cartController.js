const mongoose = require("mongoose")
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const { isValidPrice, isValidNo, isValidQuan } = require("../validations/validation")


const createCartByParams = async function (req, res) {
    try {
        let bodyData = req.body
        let userId = req.params.userId

        if (Object.keys(bodyData).length == 0) return res.status(400).send({ status: false, message: "Please provide some data in body" })
        let { cartId, productId, quantity } = data
        if (!productId) return res.status(400).send({ status: false, message: "ProductId is mandatory" })
        if (!mongoose.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "ProductId is INVALID" })
        if (!quantity) return res.status(400).send({ status: false, message: "Quantity is mandatory" })
        if (quantity || typeof quantity == 'string') {
            if (!isValidQuan(quantity)) return res.status(400).send({ status: false, message: "Quantity should be a numeric value" })
        } else {
            quantity = 1
        }
        let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) return res.status(400).send({ status: false, message: "Product not found" })
        let price = findProduct.price
        if (cartId) {
            if (!mongoose.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "CartId is INVALID" })
        }
        let Cart = await cartModel.findOne({ _id: cartId, userId: userId })

        if (Cart) {
            let items = Cart.items
            let Object = {}
            for (let i = 0; i < items.length; i++) {

                let totalPrice = Cart.totalPrice + (quantity * price)
                let totalItem = items.length
                Object.items = items
                Object.totalPrice = totalPrice
                Object.totalItems = totalItem
                let newCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: Object }, { new: true })
                return res.status(201).send({ status: true, message: "Success", data: newCart })
            }
        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }




}



const updateCartByParams = async function (req, res) {




}






const getCartByParams = async function (req, res) {




}



const deleteCartByParams = async function (req, res) {




}


module.exports = { createCartByParams, updateCartByParams, getCartByParams, deleteCartByParams }