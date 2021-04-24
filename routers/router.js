const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const Register=require('../models/model')
const games=require('../models/games.model')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const auth =require('../auth')
router.get('/test',auth,(req,res)=>{
    res.status(200).json({
        messege:"handling request"
    })
})
 router.post('/register',(req,res)=>{
  Register.find({email:req.body.email})
    .exec()
    .then((user)=>{
        if(user.length>=1){
            console.log("user",user)
            return res.status(409).json({
                messege:"user exists"
            })
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if (err){
                res.status(500).json({
                messege:"error while hasing",
                error:err
                })
                console.log(err);
                }else{
                    const registerUser=new Register({
                        _id:mongoose.Types.ObjectId(),
                        name:req.body.name,
                        password:hash,
                        age:req.body.age,
                        location:req.body.location,
                        email:req.body.email,
                        phone:req.body.phone
                     })
                     registerUser.save().then((result)=>{
                         console.log("resul",result)
                         res.status(200).json({
                            messege:"Registered",
                            data:registerUser
                        })
                     }).catch((err)=>{
                         res.status(500).json({
                             error:err
                         })
                     })
                }
            })
        }
    })
   
})
router.post("/login",(req,res)=>{
    Register.find({phone:req.body.phone})
    .exec()
    .then(async user=>{
        if(user.length<1){
         return res.status(401).json({
                messege:" user not found"
            })
        }
      const compare=await bcrypt.compare(req.body.password,user[0].password)
      try{
        if(compare){
            const token=jwt.sign({
                phone:user[0].phone,
                id:user[0].id
            },'secret key',{expiresIn:"1h"})
            console.log("key",token);
            return res.status(200).redirect('/games/view')
        }
       
      }catch(err){
           console.log(err)
      }
           
        
    })
    .catch(err=>{
        res.status(401).json({
            messege:"authentication failed",
            error:err
        })
    })
})
    router.patch('/update/:id',(req,res)=>{

        console.log(req.params.id)
        bcrypt.hash(req.body.password,10,async(err,hash)=>{
            if(err){
                console.log("error",err);
                res.status(500).json({
                    mess:"error",
                    error:err
                })
            }else{
                try{
                    const user=await Register.findById(req.params.id)
                    user.name=req.body.name,
                    user.password=hash,
                    user.age=req.body.age,
                    user.location=req.body.location,
                    user.email=req.body.email
                    const value=await user.save()
                    console.log(value)
                    res.status(200).json({
                        messege:"sucess",
                        data:value
                    })
                }catch(err){
                    console.log(err)
                    res.status(500).json({
                        messege:"failed",
                        value:err
                    })
                }
            } 
        })
    })
    router.get('/games/view',(req,res)=>{
            games.find().then((mess)=>{
            console.log("mess",mess)
            res.status(200).json({
                messege:"sucess",
                data:JSON.stringify(mess)
            })
            
        }).catch(err=>res.status(500).json({error:err}))    
})
router.post('/games',auth,(req,res)=>{
  const newGame=new games({
    _id:mongoose.Types.ObjectId(),
    userId1:req.body.userId1,
    userId2:req.body.userId2,
    ScoreU1:req.body.ScoreU1,
    ScoreU2:req.body.ScoreU2,
    win:req.body.win
  })
  newGame.save().then((mess=>{
      res.status(200).json({
          messege:"Saved",
          data:newGame,
      })
  })).catch((err)=>{
      res.status(500).json({
          error:err
      })
      console.log(err)
  })
})
router.patch('/games/update/:id',auth,async(req,res)=>{
    console.log(req.params.id);
    try{
        const result=await games.findById(req.params.id)
        console.log("result",result);
        result.ScoreU1=req.body.ScoreU1,
        result.ScoreU2=req.body.ScoreU2,
        result.win=req.body.win
       const value=await result.save()
       res.status(200).json({
           messege:"sucess",
           data:value
       })
    }catch(err){
        res.send("err")
        console.log(err)
    }
})
router.get("/leaderboard",async(req,res)=>{
       try{
           const leaderboard=[]
           const obj={}
        const data=await games.find()
        data.map((values)=>{
            if(values.ScoreU1>values.ScoreU2){
                obj.gameId=values._id
                obj.Rank1="user1",
                obj.Rank2="user2",
                obj.Totalpoints=values.ScoreU1
                leaderboard.push(obj)
            }else{
                obj.gameId=values._id
                obj.Rank1="user2",
                obj.Rank2="user1",
                obj.Totalpoints=values.ScoreU2
                leaderboard.push(obj)
            }
        })
        res.send(leaderboard)

       }catch(err){
         console.log("err",err);
       }
      

})
 
module.exports=router
