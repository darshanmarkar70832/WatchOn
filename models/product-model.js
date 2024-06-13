const mongoose = require("mongoose")


const productShema = mongoose.Schema({
    image: String,
   name:String,
    password:String,
    price:Number,
   discount:{
        type:Number,
        default:0
    },
    bgcolor:String,
    panelcolor:String,
    textcolor:String
})
module.exports = mongoose.model("product",productShema)
