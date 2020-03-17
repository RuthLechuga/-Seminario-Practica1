var express = require('express');

var app = express();
const bodyParser = require('body-parser');
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

app.post('/register', function(req,res) {

 const datos = req.body;
 const username = datos.username;
 const password = datos.password;
// const url_photo = '';

 let params = {
	TableName: 'usuarios',
	Item: {
		'username': username,
		'password': password
		//'url_photo': url_photo
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
