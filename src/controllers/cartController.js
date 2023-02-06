const mongoose = require("mongoose")
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const { isValidPrice, isValidNo, isValidQuan } = require("../validations/validation")


// const createCartByParams = async function (req, res) {

        // let bodyData = req.body
        // let userId = req.params.userId

        // let verifyToken= req.bearerToken;
        // if(userId!==verifyToken) return res.status(403).send({status:false,message:"You are not authorised"})

        // if (Object.keys(bodyData).length == 0) return res.status(400).send({ status: false, message: "Please provide some data in body" })
        // let { cartId, productId, quantity } = bodyData

        // // cartId object valid id object id
        // if (!productId) return res.status(400).send({ status: false, message: "ProductId is mandatory" })
        // if (!mongoose.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "ProductId is INVALID" })
        // if (!quantity) return res.status(400).send({ status: false, message: "Quantity is mandatory" })
        // if (quantity || typeof quantity == 'string') {
        //     if (!isValidQuan(quantity)) return res.status(400).send({ status: false, message: "Quantity should be a numeric value" })
        // } else {
        //     quantity = 1
        // }
        // let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        // if (!findProduct) return res.status(400).send({ status: false, message: "Product not found" })
        // let price = findProduct.price
        // if (cartId) {
        //     if (!mongoose.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "CartId is INVALID" })
        // }
        // let Cart = await cartModel.findOne({ _id: cartId, userId: userId })

        // let totalPrice=0
        // let totalItem=0

        // if (Cart) {
        //     let items = Cart.items
        //     let Object = {}
        //     for (let i = 0; i < items.length; i++) {
        //         if (items[i].productId.toString() == productId) {

        //         items[i]['quantity'] = (items[i]['quantity']) + quantity
        //          totalPrice = Cart.totalPrice + (quantity * price)
        //          totalItem = items.length
        //         Object.items = items+1
        //         Object.totalPrice = totalPrice
        //     Object.totalItems = totalItem
        //     let newCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: Object }, { new: true }).populate('items.productId')
        //     return res.status(201).send({ status: true, message: "Success", data: newCart })
        //         }
               
        //     }
            
        // }else{
        //     bodyData.totalPrice=totalPrice
        //     bodyData.totalItems=totalItem
        //     let newCarts = await cartModel.create(bodyData)
        //     return res.status(201).send({ status: true, message: "Success", data: newCarts })
        // }
       

        const createCartByParams = async function (req, res) {
            try {
                let userId = req.params.userId
                if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid User Id" })
                let findUser = await userModel.findById(userId)
                if (!findUser) return res.status(404).send({ status: false, message: "User not found" })
                
                let data = req.body
                let { cartId, productId, quantity } = data
                if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "No data given for creation" })
        
                if (!productId) return res.status(400).send({ status: false, message: "Product Id is mandatory" })
                // if (!isValid(productId)) return res.status(400).send({ status: false, message: "Product Id can't be empty" })
                if (!mongoose.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Invalid Product Id" })
        
                if (cartId) {
                    // if (!isValid(cartId)) return res.status(400).send({ status: false, message: "Cart Id can't be empty" })
                    if (!mongoose.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Invalid Cart Id" })
                }
        
                if (!quantity) {
                    if (quantity == 0) return res.status(400).send({ status: false, message: "Quantity should be greater than 0" })
                    quantity = 1
                }
                if (typeof quantity !== 'number') return res.status(400).send({ status: false, message: "Invalid quantity" })
        
                let product = await productModel.findById(productId)
                if (!product || product.isDeleted == true) return res.status(404).send({ status: false, message: "Product not found" })
        
                if (cartId) {
                    const findCart = await cartModel.findById(cartId).populate([{ path: 'items.productId' }])
                    if (!findCart) return res.status(404).send({ status: false, message: "Cart not found" })
                    if (findCart.userId.toString() !== userId) return res.status(403).send({ status: false, message: "Unauthorized User" })
        
                    let itemsArray = findCart.items
                    let totalPrice = findCart.totalPrice
                    let totalItems = findCart.totalItems
                    let newProduct = true
        
                    for (let i = 0; i < itemsArray.length; i++) {
                        if (itemsArray[i].productId._id.toString() == productId) {     //product already exists in the cart
                            itemsArray[i].quantity += quantity
                            totalPrice += itemsArray[i].productId.price * quantity
                            newProduct = false
                        }
                    }
                    if (newProduct == true) {                                    //product does not exist in the cart
                        itemsArray.push({ productId: productId, quantity: quantity })
                        totalPrice += product.price * quantity
                    }
                    totalPrice = totalPrice.toFixed(2)
                    totalItems = itemsArray.length
        
                    const addToCart = await cartModel.findOneAndUpdate({ _id: cartId }, { items: itemsArray, totalPrice: totalPrice, totalItems: totalItems }, { new: true }).select({ __v: 0 })
        
                    if (!addToCart) return res.status(404).send({ status: false, message: "Cart not found" })
                    else return res.status(200).send({ status: true, message: "Success", data: addToCart })
                }
        
                else {
                    let cartData = {
                        userId: userId,
                        items: [{
                            productId: productId,
                            quantity: quantity
                        }],
                        totalPrice: (product.price * quantity).toFixed(2),
                        totalItems: quantity
                    }
        
                    const findCart = await cartModel.findOne({userId})
                    if (findCart) return res.status(400).send({ status: false, message: "Cart already exists for this user so enter cartId" })
        
                    const createCart = await cartModel.create(cartData)
                    return res.status(201).send({ status: true, message: "Success", data: createCart })
                }
        
            }catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
// }



const updateCartByParams = async function (req, res) {




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
    let user = await userModel.findOne({_id : userId })
    if(!user) return res.status(404).send({status : false, message : "user doesn't exist or deleted"})

    //checking if the cart exist
    let cart = await  cartModel.findOne({userId : userId}).select({__v : 0})
    if(!cart)  return res.status(404).send({status : false, message: "No cart exist"})

    res.status(200).send({status : true , message : "Success", data : cart})
    }catch(err){
        return res.status(500).send({status:false, error : err.message})
    }

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
       
        return res.status(204).send({status : true , message : "success", data : {}}) // response struture
       

    } catch (error) {
        return res.status(500).send({status: false,error:error.message})
    }
    
   


}


module.exports = {createCartByParams,updateCartByParams,getCartByParams,deleteCartByParams}
