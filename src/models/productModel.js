const mongoose = require ("mongoose")

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true

    },
    price: {
        type: Number,
        required: true
    },
    currencyId: {
        type: String,
        required: true,
        enum:["INR"]
    },
    currencyFormat: {
        type: String,
        required: true,
        enum:["₹"]
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    productImage: {
        type: String,
        required: true
    },  // s3 link
    style: {
        type: String
    },
    availableSizes: {
        type: [String],
       enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
        required: true
    },
    installments: {
        type: Number
    },
    deletedAt: {
        type: Date 
    },
    isDeleted: {
        type: Boolean,
        default: false
    },


}, { timestamp: true })

module.exports= mongoose.model("ProductCollection",productSchema)