const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>{
    try{
        const token =req.headers.authorization.split(" ")[1]
        console.log("token head",token);
        const decoded=jwt.verify(token,'secret key')
        console.log(decoded)
        next()
    }

    catch(error){
        console.log(error)
        res.status(401).json({
            messege:"Unauthorized"
        })
    }
   
}