const mongoose= require("mongoose")
const ObjectId= mongoose.Schema.Types.ObjectId

const orderSchema= new mongoose.Schema({
    userId: {
        type: ObjectId, 
        ref: "UserCollection",
        required: true,
        // unique:true,
        trim:true
    },
    items: [{
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
    totalQuantity: {
      type: Number, 
      required:true,
      
    },
  cancellable: {
    type: Boolean,
     default: true
    },
  status: {
    type:String, 
    default: 'pending',
    enum:["pending", "completed", "cancelled"]
   },
  deletedAt: {
    type:Date, 
   }, 
  isDeleted: {
    type:Boolean,
     default: false
    },
     

},{timestamp:true})
module.exports= mongoose.model("OrderCollection",orderSchema)
