const userModel = require("../model/userModel")

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
    let data = req.body
    let profileImage= req.profileImage



    if(profileImage && profileImage.length>0){
        let uploadedFileURL= await uploadFile( profileImage[0] )
        body.bookCover = uploadedFileURL
  
    }
    else{
       return res.status(400).send({ msg: "Please enter profile image in body" })
    }

    let createUser = await userModel.create(data)

}