const mongoose=require('mongoose')
const gamesSchema=({
    _id:mongoose.Schema.Types.ObjectId,
    userId1:String,
    userId2:String,
    ScoreU1:{type:Number,required:true},
    ScoreU2:{type:Number,required:true},
    win:Boolean
})
module.exports=mongoose.model('games',gamesSchema)