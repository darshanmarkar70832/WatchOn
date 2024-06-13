const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/watchon")
.then(()=>{
    console.log("connected")
})
.catch((err)=>{
console.log(err)
})

module.exports = mongoose.connection