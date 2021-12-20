const mongoose = require("mongoose");



const SingUpSchema = mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        default:''
    },
    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    }




})

module.exports = SingUpSchema;