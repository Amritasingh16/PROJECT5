router.post("/create",async function(req,res){
    let data = req.body
    let save = await usenModel.create(data)
    res.send({data : save})
})

router.post("/login", async function(req,res){
    const {email,password} = req.body

    if(!email) return res.status(400).send({status:false, message: "email is required"})
    if(!password) return res.status(400).send({status:false, message: "password is required"})

    const exist = await userModel.findOne({email : email, passowrd : password})

    if (!check){
        return res.status(404).send({status : false, message : "email or password is incorrect"})

    }else{
        let token = jwt.sign({userId : exist._id.toString()}, "dummykey",{expiresIn : "1h"})
        return res.status(200).send({status : true, message : "User login successful",data : {userId : exist._id, token : token}})
    }
})
