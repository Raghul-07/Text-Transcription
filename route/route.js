const express = require("express");

var mongoose = require('mongoose');
var TextTranscript = require('../model/transcription');

/*   
    Routing helps you to change the state of the application. 
    i.e. moving from one section to another 
*/
const router = express.Router();

const {transcript}=require('../controller/transcription');
const {users}=require('../controller/auth')

router.route('/store').post(transcript);
router.route('/create').post(users);

router.get('/', function(req, res, next) {
      
    TextTranscript.find((err, docs) => {
        if (!err) {
            res.render("uploads", {
                data: docs
            });
        } else {
            console.log('Failed to retrieve : ' + err);
        }
    });
 
});

module.exports = router;