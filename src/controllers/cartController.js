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




}



const deleteCartByParams = async function(req,res){

    try {
        let userId=req.params.userId;
        let verifyToken= req.bearerToken;

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId is invalid" })
        if(userId!==verifyToken) return res.status(403).send({status:false,message:"You are not authorised"})
       
        let usercheck=await userModel.findOne({_id:userId})
        if(!usercheck) return res.status(404).send({status:false,message:"User not Found"})

        let cartDelete=await cartModel.findOneAndUpdate({userId:userId},{$set:{items:[],totalItems:0,totalPrice:0}},{new:true})
        if(!cartDelete) return res.status(404).send({status:false,message:"Cart Doesn't Exist"})
       
        return res.status(204).send() // response struture
       

    } catch (error) {
        return res.status(500).send({status: false,error:error.message})
    }
    
   


}


module.exports = {createCartByParams,updateCartByParams,getCartByParams,deleteCartByParams}