const mongoose = require("mongoose")
const config = require("config")
const { MONGODB_URI, JWT_KEY } = process.env;


const dbgr = require("debug")("development:mongoose")


mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log("connected")
})
.catch((err)=>{
console.log(err)
})

module.exports = mongoose.connection