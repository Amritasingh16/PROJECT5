const userModel = require("../model/userModel")
const mongoose = require("mongoose")
const {uploadFile} = require("../middlewares/aws")
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { isValidName,isValidEmail,isValidNo,isValidPassword,isValidPin } = require("../validations/validation");


  
const registerUser = async function(req,res){
    let body = req.body
    let files= req.files
    if(body.address){
        if(typeof body.address != "object") return res.status(400).send({ status: false, message: "Address must be in object form." });

    body.address = JSON.parse(body.address)
    }
    let {fname,lname,email,profileImage,phone,password,address} = body

if (!body || Object.keys(body).length == 0)return res.status(400).send({ status: false, message: "Enter data in body." })
// let a=["fname","lname","email","profileImage","phone","password","address"]
// keys=Object.keys(body)
// for(let i=0;i<a.length;i++){
// if(!keys.includes(i))
// return res.send({msg:"'${i}'is mandatory"})
// }

if(!fname) return res.status(400).send({status:false,message:"Please provide first name in body."})

if(!isValidName(fname)) return res.status(400).send({status:false,message:"FirstName should have only letters and minumum 3 letters."})

if(!lname) return res.status(400).send({status:false,message:"Please provide last name in body."})
if(!isValidName(lname)) return res.status(400).send({status:false,message:"LastName should have only letters and minumum 3 letters."})

if (!email) return res.status(400).send({ status: false, message: "Please enter email in body." })
if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Please enter valid email." })
let emailPresent = await userModel.findOne({email:email})
if(emailPresent) return res.status(400).send({ status: false, message: "This email already exists." })
 
if(!phone) return res.status(400).send({ status: false, message: "Please enter phone number in body." })
if (!isValidNo(phone))return res.status(400).send({status: false,message: "Please enter a valid Mobile number.",});
let phonePresent = await userModel.findOne({phone:phone})
if(phonePresent) return res.status(400).send({ status: false, message: "This phone number already exists." })

if (!password) return res.status(400).send({ status: false, message: "Please enter password in body." });
// if(password.length<8 || password.length>15)  return res.status(400).send({ status: false, message: "Password's length must be between 8 & 15." });
if (!isValidPassword(password))return res.status(400).send({status: false,message:"Password must be in the Range of 8 to 15 , it must contain atleast 1 lowercase, 1 uppercase, 1 numeric character and one special character."});

if(!address) return res.status(400).send({ status: false, message: "Please enter address in body." })
if(typeof address != "object") return res.status(400).send({ status: false, message: "Address must be in object form." });
let {shipping,billing}=address

if(!shipping) return res.status(400).send({ status: false, message: "Please enter shipping in body." });
if(typeof shipping != "object") return res.status(400).send({ status: false, message: "Shipping must be in object form." });

if(!shipping.street) return res.status(400).send({ status: false, message: "Please enter street in shipping." });
if(typeof shipping.street != "string") return res.status(400).send({ status: false, message: "street must be in string form." });

if(!shipping.city) return res.status(400).send({ status: false, message: "Please enter city in shipping." });
if(typeof shipping.city != "string") return res.status(400).send({ status: false, message: "City must be in string form." });

if(!shipping.pincode) return res.status(400).send({ status: false, message: "Please enter pincode in shipping." });
if(typeof shipping.pincode != "number") return res.status(400).send({ status: false, message: "Pincode must be in string form." });
if (!isValidPin(shipping.pincode))return res.status(400).send({ status: false, message: "Shipping Pincode must be in number form." });


if(!billing) return res.status(400).send({ status: false, message: "Please enter billing." });
if(typeof billing != "object") return res.status(400).send({ status: false, message: "billing must be in object form." });

if(!billing.street) return res.status(400).send({ status: false, message: "Please enter street in billing." });
if(typeof billing.street != "string") return res.status(400).send({ status: false, message: "street must be in string form." });

if(!billing.city) return res.status(400).send({ status: false, message: "Please enter city in billing." });
if(typeof billing.city != "string") return res.status(400).send({ status: false, message: "City must be in string form." });

if(!billing.pincode) return res.status(400).send({ status: false, message: "Please enter pincode in billing." });
if(typeof billing.pincode != "number") return res.status(400).send({ status: false, message: "Billing Pincode must be in number form." });
if (!isValidPin(billing.pincode))return res.status(400).send({ status: false, message: "Please enter valid pincode." });





let hashing = bcrypt.hashSync(body.password,10)
body.password=hashing

    if(files && files.length>0){
        let uploadedFileURL= await uploadFile(files[0] )
        body.profileImage = uploadedFileURL
  
    }
    else{
       return res.status(400).send({ msg: "Please enter profile image in body" })
    }
    

    let createUser = await userModel.create(body)
    return res.status(201).send({status:true,message:"User created successfully",data:createUser})
}






let loginUser = async function(req,res){
    try{
    const {email,password} = req.body

    if(!email) return res.status(400).send({status:false, message: "email is required"}) 
    let check = await userModel.findOne({email : email})  // for getting the hashed password from db
    if(!check) return res.status(404).send({status : false, message: "email is not found"})

    let hashedToken = check.password        // assign hashed token into hashedToken

    if(!password) return res.status(400).send({status:false, message: "password is required"})

    let decrypt = await bcrypt.compare(password,hashedToken)  // have boolean true or false 

    if(decrypt === true){
        let token = jwt.sign({userId : check._id.toString()}, "dummykey",{expiresIn : "1h"})
        return res.status(200).send({status : true, message : "User login successful",data : {userId : check._id, token : token}})
    }else{
        return res.status(400).send( {status : false, message : "enter valid password"})
    }
    }catch(err){
        res.status(500).send({status : false, error : err.message})
    }

}



    const getUserByParams = async function(req,res){
    try {
        let userId=req.params.userId
        if(!userId) return res.status(400).send({ status: false, message: "userId is required in params" })
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId is invalid" })
        let verifyToken= req.bearerToken;
       
        if(userId!==verifyToken) return res.status(403).send({status:false,message:"You are not authorised"})
        
        let getUser=await userModel.findOne({_id:userId})
        if(!getUser)return res.status(404).send({status: false, message: "userdetails not found"})


        return res.status(200).send({status:true,message: "User profile details",data:getUser})

    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}







module.exports={registerUser,loginUser,getUserByParams}