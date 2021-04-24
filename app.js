const express=require('express')
const routes=require('./routes/routes')
const mongoose=require('mongoose')
const cors = require('cors');
const paths=require('./routes/games.routes')
const app=express()
app.use(cors())
// app.use(require('connect').bodyParser())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
mongoose.connect('mongodb+srv://leaderboard:rctUFPqm.Vj4m4.@cluster0.4qveg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
 { useNewUrlParser: true,useUnifiedTopology: true,useUnifiedTopology: true,useCreateIndex: true,useNewUrlParser: true })
app.use('/',routes)
app.listen(7002, () => {
    console.log("listening at 7002")
})
