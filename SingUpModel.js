const mongoose = require("mongoose");
const SingUpSchema = require("./SingUPSchema");




const SingUpModel = mongoose.model('user', SingUpSchema);




module.exports = SingUpModel;

