const configFile = "./config/PLEASE-FIX-ME.json";
const port = 80
const http = require("http");
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const formidable = require('formidable');
const express = require('express');
const app = express()
var error;

app.use(express.static('public'));

app.post('/celebrity', function(request, response) {
   let form = new formidable.IncomingForm();

   form.parse(request, function (err, fields, files) {
      getCelebrity(files.upload.path, celebrityHandler);
   });

   function celebrityHandler(err, result) {
      if(err) {
         console.log(err);
         var content = `<div id="results"> \
            <h3>Erro:</h3> \
            <p> ${err} </p> \
            </div>`;

         response.send(content);
      } else {
         console.log("Celebrity:");
         console.log(result);
         // Print celebrity data
         var content = `<div id='results'> \
            <h3>Results:</h3> \
            <p>Name: ${result.Name} </p> \
            <p>Confidence: ${result.Confidence} </p> \
            <p>Source: <a href="http://${result.Url}" target="_new">${result.Url}</a></p> \
            </div>`;

         response.send(content);
      }
   }

   // Get AWS region to call APIs
   function getRegion() {
      try {
         let config = require(configFile);
         let region = config.region;

         return region;
      } catch(err) {
         throw new Error("Cannot find configuration file: "+ configFile);
      }
   }   

   function getCelebrity(image, callback) {
      try {
         // Get image data
         let buffer = fs.readFileSync(image);
         let awsRegion = getRegion();
         let rekognition = new AWS.Rekognition({ apiVersion: '2016-06-27', region: awsRegion });
         let params = {
            Image: {
               Bytes: Buffer.from(buffer)
            }
         };

         rekognition.recognizeCelebrities(params, function (err, data) {
            // Problem calling API
            if (err) {
               return callback(err, null);
            } 
            
            let infoCelebrity;
            // Verify if indentified celebrity on image
            if (data.CelebrityFaces.length != 0) {
               infoCelebrity = {
                  "Name": data.CelebrityFaces[0].Name,
                  "Confidence": data.CelebrityFaces[0].MatchConfidence,
                  "Url": data.CelebrityFaces[0].Urls[0]
               }
            } else {
               infoCelebrity = {
                  "Name": "Not possible to find.",
                  "Confidence": "Not possible to find.",
                  "Url": "Not possible to find."
               }
            }
            
            callback(null, infoCelebrity);
         });   
      } catch (err) {
         return celebrityHandler(err, null);
      }   
   }   
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
