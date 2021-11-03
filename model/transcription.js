const mongoose = require('mongoose');

// Schema
var TranscriptionSchema = new mongoose.Schema({
    filename : {
        type : String,
        required : "Required"
    },
    filetype : {
        type : String,
    },
    texttranscription : {
        type : String,
    },
    uid : {
        type : String,
    }
});

// Define the schema as model for mongoose
const TextTranscript = mongoose.model('TextTranscriptions', TranscriptionSchema);

module.exports=TextTranscript;