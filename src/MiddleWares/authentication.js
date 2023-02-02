const jwt = require("jsonwebtoken")

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