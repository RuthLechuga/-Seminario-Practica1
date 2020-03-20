const AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});
const rekognition = new AWS.Rekognition();
var datos  = [];
var objeto = {};

exports.handler = async(event, context, callback) => {
    let body = event; //test y api-rest (sin proxy)
    const similar = 70; //porcentaje de confianza
    const username = event.username; // nombre de usuario
    const bucket = "bucketfotos10";//nombre del bucket
    
    
    const params1 = {
        TableName : "usuarios",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        }
    };
    
    const params2 = {
        TableName : "fotos",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        }
    };
    
    
    let arr = "";
    let direccion = "";
    let direcciones = "";
    let targetFilepath = "";
    
    try {
        const obj1 = await documentClient.query(params1).promise();
        try{
            arr = obj1['Items'];
            direccion = arr[0].url_photo;
            direcciones = direccion.split('/');
            targetFilepath = direcciones[3]+"/"+direcciones[4];
        }catch(e2){ return "No hay foto" }
        
        
        datos  = [];
        objeto = {};
        const obj =  await documentClient.query(params2).promise();
        arr = "";
        arr = obj['Items']
           for (const prop in arr) {
               direccion = arr[prop].nombre_foto;
               direcciones = direccion.split('/')
               const sourceFilepath = direcciones[3]+"/"+direcciones[4];
               
                const param1 = {
                    SourceImage: {//captura o foto
                        S3Object: {
                            Bucket: bucket,
                            Name: sourceFilepath
                        },
                    },
                    TargetImage: {//foto perfil
                        S3Object: {
                            Bucket: bucket,
                            Name: targetFilepath
                        },
                    },
                    SimilarityThreshold: similar
                }
                
                
                try{
                const obj2 = await rekognition.compareFaces(param1).promise(); 
                if(obj2.FaceMatches.length == 1)
                {
                    datos.push({ 
                        "imagen" : direccion, 
                    }); 
                }
                }catch (e1){
                    continue;
                }
                
                
           }
            objeto.datos = datos;
                return {
                Imagenes: datos,
                };                
    }
    catch (e) {
        return {
            error: e,
        };
    }
};