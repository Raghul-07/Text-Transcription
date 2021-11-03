const mongoose = require('mongoose');

// Schema
var UserSchema = new mongoose.Schema({
    mailId : {
        type : String,
        unique : true,
        required : "Required"
    },
});

//Define the schema as model for mongoose
const user = mongoose.model('users', UserSchema);

module.exports=user;