const mongoose= require("mongoose")
const ObjectId= mongoose.Schema.Types.ObjectId

const cartSchema= new mongoose.Schema({
    userId: {
        type: ObjectId, 
        ref: "UserCollection",
        required: true,
        // unique:true,
        trim:true
    },
    items: [{
        _id : 0,
      productId: {
        type:ObjectId, 
        ref: "ProductCollection",
        required: true
    },
      quantity: {
        type:Number,
        required:true,
        trim:true //min 1
    }
    }],
    totalPrice: {
        type:Number,
        required:true, // comment: "Holds total price of all the items in the cart"
        trim:true
    },
    totalItems: {
        type:Number,
        required:true, //comment: "Holds total number of items in the cart"
        trim:true
    },
     

},{timestamp:true})
module.exports= mongoose.model("CartCollection",cartSchema)
