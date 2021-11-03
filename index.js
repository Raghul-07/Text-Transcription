require("dotenv").config({ path: "./config.env" });

const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser')
const {users} = require('./controller/auth')

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "740359070855-6gk4r8j1hvhaspjqe9hbde2qcqr0p193.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// CORS - Cross Origin Resource Sharing
const cors = require('cors');

// File upload
const upload = require('express-fileupload');

const connectDB = require('./database/dbconfig');
const { transcription } = require("./controller/transcription");

var email

app.set('view engine', 'ejs');

// Express allows you to configure and manage an HTTP server to access resources from the same domain
app.use(cors());

// It allow us to send json data from back end to front end
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

// Connecting with db
connectDB();

app.use("/api/transcription", require('./route/route'));
app.use("/uploads", require('./route/route'));

app.use(upload());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/login.html'));
});

app.post("/", (req, res) => {
    let token = req.body.token;
    var mailid = '';
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        //const userid = payload['sub'];
        mailid = payload['email'];
        console.log(payload);
      }
      verify().then(()=>{
        users(mailid);
        res.cookie('session-token', token)
        res.send('success')
      }).catch(console.error);
})

app.get("/home", checkAuthenticated, (req, res) => {
    let user = req.user
    email = user.email
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.post("/home", (req, res)=>{
    var file
    if(req.files){
        //console.log(req.files)
        file = req.files.file
        var filesize = file.data.length
        if(filesize>16000000){
            res.send("File must be less than 16MB")
        }
        transcription(file, email)
        res.redirect('/home');
    }
})

app.get("/uploads", (req, res) => {
    res.render('uploads')
    //res.sendFile(path.join(__dirname+'/myuploads.html'))
})

app.get("/logout", (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/');
})

function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/')
      })
}

app.listen("3000", ()=>{
    console.log("Server Started");
});