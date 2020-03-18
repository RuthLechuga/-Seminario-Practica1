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
 let url_photo = "null";
 console.log("username:",username);
 console.log("password:",password);

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
			url_photo = data.Location;
			console.log("x1",url_photo);
      		}
    	});
 }
 console.log("x2:",url_photo);

 let params = {
	TableName: 'usuarios',
	Item: {
		'username': username,
		'password': password,
		'url_photo': url_photo
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
});
