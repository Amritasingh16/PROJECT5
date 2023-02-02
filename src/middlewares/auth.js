const jwt = require("jsonwebtoken")
const authentication = async function(req,res,next){
    try{
        let bearerToken  = req.header("Authorization")
    
       
        if(!bearerToken) return res.status(400).send({status : false, message : "bearerToken is mandatory"})
        bearerToken = bearerToken.replace("Bearer ","")
        jwt.verify(bearerToken,"dummykey",function(err,decode){
            if(err){
                return res.status(401).send({status:false,message:err.message})
            }else{
                req.bearerToken = decode.userId
    
    
                next()
            }
        
        })
    
        }
    
    
catch(err){
    return res.status(500).send({status:false,message:err.message})
}

}

module.exports = {authentication}