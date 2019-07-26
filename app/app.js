const configFile = "./config/config.json";
const port = 8082
const http = require("http");
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const formidable = require('formidable');
var error;

// Web Server listening on port 80
http.createServer(function (request, response) {

   // Find celebrity
   if (request.url == '/celebrity' && request.method == 'POST') {
      let form = new formidable.IncomingForm();

      form.parse(request, function (err, fields, files) {
         getCelebrity(files.upload.path, celebrityHandler);
      });

         //return;
   } else if (request.url.match("\.css$")) {
      let cssPath = path.join(__dirname, request.url);
      let fileStream = fs.createReadStream(cssPath, "UTF-8");
      response.writeHead(200, { 'content-type': 'text/css' });
      fileStream.pipe(response);

   } else if (request.url.match("\.jpg$")) {
      let imagePath = path.join(__dirname, request.url);
      let fileStream = fs.createReadStream(imagePath);
      response.writeHead(200, { 'content-type': 'image/jpg' });
      fileStream.pipe(response);
  
   } else {
      // Print main html
      fs.readFile('./index.html', function (err, html) {
         response.writeHead(200, { 'content-type': 'text/html' });
         response.write(html);
         response.end();
      });
   }

   function celebrityHandler(err, result) {
      if(err) {
         console.log("Error:");
         console.log(err);
         fs.readFile('./index.html', function (err2, html) {
            response.writeHead(200, { 'content-type': 'text/html' });
            data = html + "<div id='results'> \
            <h3>Erro:</h3> \
            <p> "+ err +"</p> \
            </div>";
            response.write(data);
            response.end();
         });
         return;
      }

      console.log("Celebrity:");
      console.log(result);
   
      // Print html with celebrity data
      fs.readFile('./index.html', function (err, html) {
         response.writeHead(200, { 'content-type': 'text/html' });
         data = html + "<div id='results'> \
         <h3>Results:</h3> \
         <p>Name: " + result.Name + "</p> \
         <p>Confidence: " + result.Confidence + "</p> \
         <p>Source: <a href='http://" + result.Url + "' target='_new'>"+ result.Url +"</a></p> \
         </div>";
         response.write(data);
         response.end();
      });
   }

   // Get AWS region to call APIs
   function getRegion() {
      try {
         let config = require(configFile);
         let region = config.region;

         return region;
      } catch(err) {
         throw new Error("Error reading configuration file: "+ configFile);
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
}).listen(port);

console.log("Server listening on port " + port);