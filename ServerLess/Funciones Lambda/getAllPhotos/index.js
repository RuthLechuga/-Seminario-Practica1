console.log('Loading function');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});

exports.handler = (e, ctx,callback) =>{
    const username = e.username;
    
    var params = {
        TableName : "fotos",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        }
    };
    
    docClient.query(params, function(err, data){
        if(err){
            callback(err, null);
        }else {
            const response = {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
              },
              body: data
            };
            
            callback(null, response);
            //callback(null,data);
        }
    });
};