const express = require('express')
const route = require('./routes/route')
const mongoose = require('mongoose')
var cors = require('cors')
const multer= require("")


const app = express()
app.use(express.json())
app.use(cors())

mongoose.set('strictQuery', false)
mongoose.connect("", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.log(err))

app.use("/", route)

app.listen(3000, function () {
    console.log("Express app running on port 3000")
})