const productModel = require("../model/productModel")
const {uploadFile} = require("../middlewares/aws")

const createProduct = async function (req, res) {
    try {
        let data = req.body                                                               
        let files = req.files

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


const getProductsByQuery = async function(req,res){
let query = req.query
if(Object.keys(query).length==0){
    let allData = await productModel.find({isDeleted:false})
    return res.status(200).send({status:true,message:"Success",data:allData})
}
else{
    let {size,name,priceGreaterThan,priceLessThan,priceSort} = query
    //
    let obj = {}

if(size){
    
     obj.availableSizes = [size]
    console.log(obj.size)
}
if(name){
   //var r= new RegExp(`/.*${name}.*/`)
   //console.log(typeof r)
   //r = r.replace("poi",name)
    obj.title = {$regex:name}
    console.log(obj.title)
}
console.log(obj)
let findData = await productModel.find(obj)

return res.status(200).send({status:true,message:"Success",data:findData})
}
} 


module.exports = { createProduct,getProductsByQuery }