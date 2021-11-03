const TextTranscript = require('../model/transcription');
const axios = require("axios");

auth_key = 'ac39d1d79b54417d9393224baf65595c'

var filename
var filetype
var emailid

// Getting data
exports.transcript = async (req, res)=>{
    const {filename, filetype, texttranscription, uid} = req.body
    await TextTranscript.create({filename, filetype, texttranscription, uid})
        .then(result => {
            res.status(200).send(result);
            console.log(result)
        })
        .catch(error => {console.log(error)})
}

function TextTranscription(filename, filetype, texttranscription, uid) {

  TextTranscript.create({filename, filetype, texttranscription, uid})
  .then(result => {
      console.log(result)
  })
  .catch(error => {console.log(error)})
}

function getTranscript(id) {

  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: auth_key,
      "content-type": "application/json",
      "transfer-encoding": "chunked",
    },
  });

  assembly
  .get(`/transcript/${id}`)
  .then((res) => {
    //console.log(res.data)
    if(res.data.status==='processing'){
      console.log('processing...')
      getTranscript(id);
    }
    if(res.data.status==='completed'){
      console.log('completed!!')
      console.log(emailid)
      TextTranscription(filename, filetype, res.data.text, emailid)
      console.log(res.data.text)
      return;
    }
  })
  .catch((err) => console.error(err));

}

exports.transcription = async (file, email)=>{
    var upload_url
    var id
    //console.log(file)
    filename = file.name
    filetype = file.mimetype
    emailid = email
    console.log(emailid)
    
    const assembly = axios.create({
        baseURL: "https://api.assemblyai.com/v2",
        headers: {
          authorization: auth_key,
          "content-type": "application/json",
          "transfer-encoding": "chunked",
        },
      });
    
    
    assembly
        .post("/upload", file.data)
        .then((result) => {
          //console.log(result.data)
          upload_url=result.data.upload_url
          assembly
            .post('/transcript', {
              audio_url: upload_url
            })
            .then((res) => {
              //console.log(res.data)
              console.log(res.data.id)
              id = res.data.id
              getTranscript(id)
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
}