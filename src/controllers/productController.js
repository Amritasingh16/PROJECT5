const productModel = require("../models/productModel")
const { uploadFile } = require("../middlewares/aws")
const { isValidTitle, isValidPrice } = require("../validations/validation")
const mongoose= require("mongoose")

//----------------------






const createProduct = async function (req, res) {
    try {
        let data = req.body
        let files = req.files


        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data
        
        if (!title) return res.status(400).send({ status: false, message: "Title is mandatory" })
        if (!description) return res.status(400).send({ status: false, message: "Description is mandatory" })
        if (!price) return res.status(400).send({ status: false, message: "Price is mandatory" })
        if (!currencyId) return res.status(400).send({ status: false, message: "CurrencyId is mandatory" })
        if (!currencyFormat) return res.status(400).send({ status: false, message: "CurrencyFormat is mandatory" })
        //if (!files(productImage)) return res.status(400).send({ status: false, message: "ProductImage is mandatory" })
        if (!availableSizes) return res.status(400).send({ status: false, message: "AvailableSizes is mandatory" })

        //===============================Validations=====================//

        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "Title should not contain Numeric and special characters" })
        if (!isValidTitle(description)) return res.status(400).send({ status: false, message: "Description should not contain Numeric and special characters" })
        if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "Invalid Price" })
        if (currencyId != 'INR') return res.status(400).send({ status: false, message: "CurrencyId must be INR" })
        if (currencyFormat != '₹') return res.status(400).send({ status: false, message: "Currency Format must be ₹" })
        if(isFreeShipping){
        if (isFreeShipping !== "true") return res.status(400).send({ status: false, message: "IsfreeShipping must be True and False" })
        }
        if (installments == '' || style == '') return res.status(400).send({ status: false, message: "Enter some data in Installments and Style" })

        let uniqueTitle = await productModel.findOne({ title: title })
        if (uniqueTitle) return res.status(400).send({ status: false, message: "Title already present" })


        if (files && files.length > 0) {
            if (files.length > 1) return res.status(400).send({ status: false, message: "You can't enter more than one file to Create" })
            let uploadedFileURL = await uploadFile(files[0])
            data.productImage = uploadedFileURL

        }
        else {
            return res.status(400).send({ message: "Please enter product image in body" })
        }




        let create = await productModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: create })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




//------------------------














const getProductsByQuery = async function (req, res) {
    let query = req.query
    if (Object.keys(query).length == 0) {
        let allData = await productModel.find({ isDeleted: false })
        return res.status(200).send({ status: true, message: "Success", data: allData })
    }
    else {
        let { size, name, priceGreaterThan, priceLessThan, priceSort } = query
        //
        let obj = {}

        if (size) {

            obj.availableSizes = [size]
            console.log(obj.size)
        }
        if (name) {
            //var r= new RegExp(`/.*${name}.*/`)
            //console.log(typeof r)
            //r = r.replace("poi",name)
            obj.title = { $regex: name }
            console.log(obj.title)
        }
        console.log(obj)
        let findData = await productModel.find(obj)

        return res.status(200).send({ status: true, message: "Success", data: findData })
    }
}















const getProductsByParams = async function (req, res) {

    try {
        let productId = req.params.productId
        if (!mongoose.isValidObjectId(productId)) return res.status(400).send({ status: false, msg: "productId is invalid" })
        let getproduct = await userModel.findOne({ _id: productId, isDeleted: false })
        if (!getproduct) return res.status(404).send({ status: false, message: "Product not found" })
        return res.status(200).send({ status: true, data: getproduct })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




const updateProductsByParams = async function (req, res) {


}



const deleteProductsByParams = async function (req, res) {
   try{
    let productId = req.params.productId
    if(!mongoose.isValidObjectId(productId)) return res.status(400).send({status:false, message: "Please provide valid productId"})
    let deleteProduct= await productModel.findOneAndUpdate({_id:productId,isDeleted:false},{isDeleted:true},{new:true})
    if(!deleteProduct) return res.status(400).send({status:false, message: "Product already deleted"})
    return res.status(200).send({status: true, message: "Success", data: "Document Deleted!"})
   }catch(err){
    return res.status(500).send({status: false, message: err.message})
   }

}


module.exports = { createProduct, getProductsByQuery, getProductsByParams, updateProductsByParams, deleteProductsByParams }