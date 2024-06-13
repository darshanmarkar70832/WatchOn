const mongoose = require("mongoose")

const userShema = mongoose.Schema({
    fullname: {
        type:String,
        minLength:3,
        trim:true
    },
    email:String,
    password:String,
    cart:{
        type:Array,
        default:[]
    },
    isadmin:Boolean,
    orders:{
        type:Array,
        default:[]
    },
    contact:Number,
    picture:string
})
module.exports = mongoose.model("user",userShema)
