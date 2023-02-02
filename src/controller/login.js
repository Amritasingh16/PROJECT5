const userModel = require("../model/userModel")

router.post("/create",async function(req,res){
    let data = req.body
    let save = await usenModel.create(data)
    res.send({data : save})
})

router.post("/login", async function(req,res){
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

})



const authentication = async function(req,res,next){
    try{
    let token  = req.header("Authorization")
    let id = req.params.userId
    if(!token) return res.status(401).send({status : false, message : "token is mandatory"})

    let verify = jwt.verify(token,"dummykey",function(err,decode){
        if(err){
            return res.status(400).send({stats:false,message:"token expired"})
        }else{
            req.token = decode.userId
            next()
        }
    
    })
}catch(err){
    return res.status(500).send({status:false,message:err.message})
}

}

module.exports.authentication = authentication





module.exports={authentication}