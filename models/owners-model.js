const mongoose = require("mongoose")


const ownerShema = mongoose.Schema({
   fullname: {
        type:String,
        minLength:3,
        trim:true
   },
    email:String,
    password:String,
   
    
    products:{
        type:Array,
        default:[]
    },
    gstin:String,
    picture:string
})
module.exports = mongoose.model("owner",ownerShema)
