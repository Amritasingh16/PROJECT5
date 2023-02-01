const userModel = require("../model/userModel")
const aws = require("aws-sdk")
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { isValidName,isValidEmail,isValidNo,isValidPassword } = require("../validations/validation");

aws.config.update({
  
    accessKeyId:"AKIAY3L35MCRZNIRGT6N",
    secretAccessKey:"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",
    region:"ap-south-1"
  })
  
    let uploadFile= async ( file) =>{
        return new Promise( function(resolve, reject) {
         
         let s3= new aws.S3({apiVersion: '2006-03-01'}); 
     
         var uploadParams= {
             ACL: "public-read",
             Bucket: "classroom-training-bucket",  
             Key: "ABBPS/ProductsManagement/" + file.originalname, 
             Body: file.buffer
         } 
     
     
         s3.upload( uploadParams, function (err, data ){
             if(err) {
                 return reject({"error": err})
             }
             console.log(data)
             console.log("file uploaded succesfully")
             return resolve(data.Location)
         })   
        })
     }
  
const registerUser = async function(req,res){
    let body = req.body
    let files= req.files
    let {fname,lname,email,profileImage,phone,password,address} = body

if (!body || Object.keys(body).length == 0)return res.status(400).send({ status: false, message: "Enter data in body." })


if(!fname) return res.status(400).send({status:false,message:"Please provide first name in body."})
if(!isValidName(fname)) return res.status(400).send({status:false,message:"FirstName should have minimum only 3 letters."})

if(!lname) return res.status(400).send({status:false,message:"Please provide last name in body."})
if(!isValidName(lname)) return res.status(400).send({status:false,message:"Last name should have letters only."})

if (!email)return res.status(400).send({ status: false, message: "Please enter email in body." })
if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Please enter valid email." })
 
if(!phone) return res.status(400).send({ status: false, message: "Please enter phone number in body." })
if (!isValidNo(phone))return res.status(400).send({status: false,message: "Please enter a valid Mobile number.",});


if (!password) return res.status(400).send({ status: false, message: "Please enter password in body." });
if (!isValidPassword(password))return res.status(400).send({status: false,message:"Password must be in the Range of 8 to 15 , it must contain atleast 1 lowercase, 1 uppercase, 1 numeric character and one special character."});

if(!address) return res.status(400).send({ status: false, message: "Please enter address in body." });
//if(typeof address != "object") return res.status(400).send({ status: false, message: "Please enter address in object form." });
if(!address.shipping) return res.status(400).send({ status: false, message: "Please enter shipping in body." });
if(!address.shipping.street||!address.shipping.city||!address.shipping.pincode) return res.status(400).send({ status: false, message: "Please enter street in shipping." });
//if(!address.shipping.city) return res.status(400).send({ status: false, message: "Please enter city in shipping." });
//if(!address.shipping.pincode) return res.status(400).send({ status: false, message: "Please enter pincode in shipping." });



    body.address = JSON.parse(body.address)




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



module.exports={registerUser,loginUser}