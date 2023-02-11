const express = require('express')
const route = require('./route/route')
const mongoose = require('mongoose')
const multer= require("multer")


const app = express()
app.use(express.json())
app.use(multer().any())

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://Bhavi:Bhavi123@cluster1.yydegcy.mongodb.net/group11Database", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.log(err))

app.use("/", route)

app.listen(3000, function () {
    console.log("Express app running on port 3000")
})




