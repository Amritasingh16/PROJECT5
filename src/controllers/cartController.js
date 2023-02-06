const mongoose = require("mongoose")
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const {isValidPrice,isValidNo} = require("../validations/validation")


const createCartByParams = async function(req,res){




}



const updateCartByParams = async function(req,res){




}






const getCartByParams = async function(req,res){
    try{
    let userId = req.params.userId
    let jwtId = req.bearerToken

    // checking user id in params is valid or not
    if(userId == undefined) return res.send(400).send({status : false , message: "please give userId in params"})
    if(!mongoose.isValidObjectId(userId))  return res.status(400).send({status : false, message : "invalid userid in params"})

    // checking userid is matched with jwt payload user id 
    if(!userId === jwtId) return res.status(401).send({status : false, message : "user is not authorized"})

    // checking if user exist or not
    let user = await userModel.findOne({userId : userId, isDeleted : false })
    if(!user) return res.status(404).send({status : false, message : "user doesn't exist or deleted"})

    //checking if the cart exist
    let cart = await  cartModel.findOne({userId : userId})
    if(!cart)  return res.status(404).send({status : false, message: "No cart exist"})

    res.status(200).send({status : true , message : "Success", data : cart})
    }catch(err){
        return res.status(500).send({status:false, error : err.message})
    }

}



const deleteCartByParams = async function(req,res){




}


module.exports = {createCartByParams,updateCartByParams,getCartByParams,deleteCartByParams}