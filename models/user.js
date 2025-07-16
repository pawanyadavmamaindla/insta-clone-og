const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dqp1kdws8/image/upload/v1752393299/jqbtvaerjzyyyb55c1hh.jpg"
    },
    following:[{
        type:ObjectId,
        ref:"User"
    }],
})

mongoose.model("User",userSchema)