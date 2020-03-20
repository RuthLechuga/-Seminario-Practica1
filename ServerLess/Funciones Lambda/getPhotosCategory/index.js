const AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});
const rekognition = new AWS.Rekognition();
var datos  = [];
var objeto = {};

exports.handler = async(event, context, callback) => {
    let body = event; //test y api-rest (sin proxy)
    const username = event.username; // nombre de usuario
    const bucket = "bucketfotos10";//nombre del bucket
    
    
    const params = {
        TableName : "fotos",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        }
    };
    
    let bandera = "";
    
    try {
        datos  = [];
        objeto = {};
        const obj =  await documentClient.query(params).promise();
           const arr = obj['Items']
           for (const prop in arr) {
               const direccion = arr[prop].nombre_foto;
               var direcciones = direccion.split('/')
               const photoFilepath = direcciones[3]+"/"+direcciones[4];
               
                   var param1 = {
                    Image: {
                        S3Object: {
                            Bucket: bucket,
                            Name: photoFilepath
                        },
                    },
                    MaxLabels: 1//Devuelve una categoria, la más alta
                }
                
                var obj2 = "";
                try{
                    obj2 = await rekognition.detectLabels(param1).promise();
                }catch (e1){
                    continue;
                }
                   const categorias = obj2['Labels']
                            datos.push({ 
                                    "imagen"    : direccion,
                                    "categoria"  : categorias[0].Name
                                });
           }
            objeto.datos = datos;
                return {
                Imagenes: datos,
                };                
    }
    catch (e) {
        return {
            error: e,
            message: "Hubo un error al obtener la imagen",
        };
    }
};