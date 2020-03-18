var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
let AWS = require('aws-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

AWS.config.loadFromPath('./config.json');
var db = new AWS.DynamoDB.DocumentClient();
s3 = new AWS.S3({apiVersion: '2006-03-01'});
var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

const DIR = './uploads';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({ storage: storage });

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/getUsers', function(req,res) {

 let scanningParameters = {
	TableName: 'usuarios',
	ScanIndexForward: false
 };

 db.scan(scanningParameters, function(err,data){

	if(err) console.log(err);

        else res.status(200).send(data).end();

 });

})

app.post('/login', function(req,res) {

 const datos = req.body;
 const username = datos.username;
 const password = datos.password;

 let params = {
	TableName: 'usuarios',
	Key: {
		"username": username
	}
 };

 db.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
	res.send({auth:false});
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
	console.log("Data:",data.Item.password);
	if(data.Item.password.localeCompare(password)==0)
		res.send({auth: true});
	else
		res.send({auth: false});

    }
 });

});

app.post('/register', upload.single('photo'), function(req,res) {

 const datos = req.body;
 const username = datos.username;
 const password = datos.password;

 if(req.file){
	console.log(req.file.filename);

	var uploadParams = { Bucket: 'bucketfotos10/usuarios', Key: '', Body: '' };
    	var file = './uploads/' + req.file.filename;

   	var fileStream = fs.createReadStream(file);
    	fileStream.on("error", function (err) {
      		console.log("File Error", err);
    	});

    	uploadParams.Body = fileStream;

    	var path = require('path');
    	uploadParams.Key = path.basename(file);

    	s3.upload(uploadParams, function (err, data) {
      		if (err) {
        		console.log("Error", err);
      		} if (data) {
        		console.log("Upload Success", data.Location);
				let params = {
					TableName: 'usuarios',
					Item: {
						'username': username,
						'password': password,
						'url_photo': data.Location
					}
				 }

				 db.put(params, function(err,data) {
					if(err){
						console.error("No se ha podido insertar el elemento, Error JSON:",JSON.stringify(err,null,2));
						res.send({register:false});
					} else {
						console.log("Dato insertado correctamente");
						res.send({register:true});
					}
				 });
      		}
    	});
 }
 else{
	let params = {
		TableName: 'usuarios',
		Item: {
			'username': username,
			'password': password,
			'url_photo': 'null'
		}
	 }

	 db.put(params, function(err,data) {
		if(err){
			console.error("No se ha podido insertar el elemento, Error JSON:",JSON.stringify(err,null,2));
			res.send({register:false});
		} else {
			console.log("Dato insertado correctamente");
			res.send({register:true});
		}
	 });
 }
});

app.post('/loadImage', upload.single('photo'), function(req,res) {

	if(!req.file){
		console.log("error!");
		res.send({auth: false});
	}
	else{
		var uploadParams = { Bucket: 'bucketfotos10/capturas', Key: '', Body: '' };
		var file = './uploads/' + req.file.filename;

		var fileStream = fs.createReadStream(file);
    		fileStream.on("error", function (err) {
      			console.log("File Error", err);
			res.send({auth:false});
		});

    		uploadParams.Body = fileStream;

		var path = require('path');
   		uploadParams.Key = path.basename(file);

    		s3.upload(uploadParams, function (err, data) {
      			if (err) {
        			console.log("Error", err);
				res.send({auth:false});
      			} if (data) {
        			console.log("Upload Success", data.Location);
				let scanningParameters = {
            				TableName: 'usuarios',
            				ScanIndexForward: false
            			};

               			db.scan(scanningParameters,function(err,data){
            				if(err){
            					console.log("Error!");
						res.send({auth: false});
            				}else {
            					data.Items.forEach(function(item) {
            						console.log(" -", item.username + ": " + item.url_photo);
							var params = {
  								SimilarityThreshold: 90,
  									SourceImage: {
   										S3Object: {
    											Bucket: "mybucket",
    											Name: "mysourceimage"
   										}
  									},
 									TargetImage: {
   										S3Object: {
    											Bucket: "mybucket",
    											Name: "mytargetimage"
   										}
  									}
 							};

 							rekognition.compareFaces(params, function(err, data) {

								if (err) console.log(err, err.stack); // an error occurred
   								else     console.log(data);           // successful response
        						});
						}
						res.send({auth: false});
            				}
				});
			}
		});
	}
});
