const productModel = require("../model/productModel")
const uploadFile = require("../MiddleWares/aws")

const createProduct = async function (req, res) {
    try {
        let data = req.body                                                               
        let files = req.files

        if (files && files.length > 0) {
            if (files.length > 1) return res.status(400).send({ status: false, message: "You can't enter more than one file for Create" })
            let uploadedFileURL = await uploadFile(files[0])
            body.profileImage = uploadedFileURL

        }
        else {
            return res.status(400).send({ msg: "Please enter profile image in body" })
        }

        let create = await productModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: create })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createProduct }