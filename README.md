# uPhotos
# Seminario de Sistemas Practica 1

## COMENZANDO:
Amazon Web Services (AWS) es una plataforma de servicios de nube que ofrece potencia de cómputo, almacenamiento de bases de datos, entrega de contenido y otra funcionalidad para ayudar a las empresas a escalar y crecer.

La siguiente plataforma es una aplicación web similar a un aplicación para almacenamiento de fotos, esta permitirá subir todo tipo de fotos. Tendrá las secciones para listar todas las fotos subidas, listarlas por álbumes o categoría y de mostrar las fotos donde el usuario aparece (por la foto de
perfil).

## LOGIN
Para la autenticación habrán dos formas de realizarlo:
- **Ingresando un nombre de usuario y contraseña**
- **Reconocimiento facial (utilizando la cámara del dispositivo)**

## ÁREA DE REGISTRO DE USUARIO
Para registrar un nuevo usuario obligatoriamente se pedirán los datos
- **Usuario**
- **Contraseña** 
- **Confirmar contraseña** 
La parte de capturar foto será opcional para el usuario de la aplicación, dependiendo si desea utilizar el reconocimiento facial.

## PÁGINA PRINCIPAL 
Fotos: Sección de la página principal donde se listarán todas las fotos subidas, además, se tendrá la opción de subir una foto almacenada en la computadora

## ÁLBUMES
En esta sección se mostrarán todas las fotos subidas de forma categorizadas, cada foto sólo pertenece a una categoría o álbum.

Fotos en las que apareces
Basado en la foto de perfil subida en el registro del usuario, se mostrarán las fotos subidas que coincidan (según el porcentaje de similitud definido por el estudiante) con la foto de perfil.

## SERVER

#### Sitio web
En esta arquitectura se tendrá un bucket de S3 que empiece con el nombre de BucketSitioWeb_10, en este se tendrá la página web con el que el usuario estará interactuando, utilizando la función de alojamiento de sitio web estático de S3.

#### Registro de un nuevo usuario
Cuando el usuario se registre, los datos ingresados se enviarán hacia la API para que las almacene el registro (nombre usuario y contraseña) en una tabla de DynamoDB, el nombre de la tabla es "usuarios". Si en el registro también se incluye la foto de perfil, la API se encargará de guardar esta foto en una carpeta dentro de un bucket de S3, el bucket tendrá un nombre que empiece con “BucketFotos_10” y la carpeta se llama “usuarios” . La dirección
web de la foto de perfil también se almacenará en la tabla de DynamoDB.

#### Login
Existen 2 opciones de autenticación:
- **Uso de credenciales**: si solo se ingresan nombre y contraseña, se enviarán estos datos a la API para que verifique que coincida con el registro en
la tabla de DynamoDB anteriormente descrita.
- **Reconocimiento facial**: si se realiza un captura por medio de la cámara del dispositivo, la foto codificada (base64 u otro) se enviará a la API
para que compare esta con la foto de perfil del usuario que está almacenada en S3. Para que sea posible la comparación de rostros, la foto capturada
debe de ser almacenada en S3, en el mismo bucket “BucketFotos_10” y en una carpeta llamada “capturas”. Para el proceso de reconocimiento facial, se deberá de utilizar la API del servicio Amazon Rekognition, mediante la API de este servicio se utilizará la función de comparar rostros, el
cual retornará

## SERVERLESS
En esta arquitectura se definirán las funcionalidades principales de la aplicación. El usuario utilizara el mismo sitio web anteriormente descrito (
alojado en el bucket S3), la cual se comunicará con una API Gateway que estará vinculada a varias funciones lambda con las funcionalidades del sitioweb:

- **Listar Fotos(Fotos)**: 
- **Listar Fotos por Categoria(Álbumes)**: Relacionada con la sección “Álbumes” del sitio web, una función lambda obtendrá las direcciones web de las
fotos almacenada en la tabla de DynamoDB correscopiende, y la información (categoría) de cada foto se obtendrá utilizando la API de Rekognition.
- **Listar Fotos en la que Aparezco**: Relacionada con la sección del mismo nombre “Listar fotos en las que apareces”, una función lambda obtendrá la
dirección web de la foto de perfil de usuario y hará la comparación con las fotos que el usuario ha subido, utilizando la API de Rekognition (este 
utiliza las direcciones web S3 de las fotos que se van a comparar), según el porcentaje de similitud definido, la API Rekognition retornará si la foto
de perfil coincide con cada foto, las que coincidan son las que se mostrarán en el sitio web.

## Sobre Amazon Web Service
Amazon Web Service es la empresa pionera en el paradigma “Infrastructure As A Service” por lo que dispone de una alta gama de servicios a precios bastante competentes para que cualquiera con conocimientos medios en programación sea capaz de levantar un data center en unos sencillos pasos.
A continuación, se detallan un poco mejor los servicios utilizados.

#### Amazon S3
Amazon Simple Storage Service (Amazon S3) es un servicio de almacenamiento de objetos que ofrece escalabilidad, disponibilidad de datos, seguridad y rendimiento líderes en el sector. Esto significa que clientes de todos los tamaños y sectores pueden utilizarlo para almacenar y proteger cualquier cantidad de datos para diversos casos de uso, como sitios web, aplicaciones móviles, procesos de copia de seguridad y restauración, operaciones de archivado, aplicaciones empresariales, dispositivos IoT y análisis de big data

#### Amazon EC2
Amazon Elastic Compute Cloud (Amazon EC2) es un servicio web que proporciona capacidad informática en la nube segura y de tamaño modificable. Está diseñado para simplificar el uso de la informática en la nube a escala web para los desarrolladores.

#### Amazon RDS
Con Amazon Relational Database Service (Amazon RDS), es sencillo configurar, utilizar y escalar una base de datos relacional en la nube. El servicio suministra capacidad rentable y escalable al mismo tiempo que automatiza las arduas tareas administrativas, como el aprovisionamiento de hardware, la configuración de bases de datos, la implementación de parches y la creación de copias de seguridad. Lo libera de estas tareas para que pueda concentrarse en sus aplicaciones y darles el rendimiento rápido, la alta disponibilidad, la seguridad y la compatibilidad que necesitan.

#### AWS Lambda
Con Lambda, puede ejecutar código para casi cualquier tipo de aplicación o servicio back-end sin tener que realizar tareas de administración. Solo tiene que cargar el código y Lambda se encargará de todo lo necesario para ejecutar y escalar el código con alta disponibilidad. Puede configurar su código para que se active automáticamente desde otros servicios de AWS o puede llamarlo directamente desde cualquier aplicación web o móvil.

#### Amazon DynamoDB
Amazon DynamoDB es una base de datos de clave-valor y documentos que ofrece rendimiento en milisegundos de un solo dígito a cualquier escala. Se trata de una base de datos duradera de varias regiones y con varios maestros, completamente administrada, que cuenta con copia de seguridad, restauración y seguridad integradas, y almacenamiento de caché en memoria para aplicaciones a escala de Internet. DynamoDB puede gestionar más de 10 billones de solicitudes por día y puede admitir picos de más de 20 millones de solicitudes por segundo.

#### Amazon Rekognition
Amazon Rekognition facilita la incorporación del análisis de imágenes y videos a sus aplicaciones. Usted tan solo debe suministrar una imagen o video a la API de Rekognition y el servicio identificará objetos, personas, texto, escenas y actividades, además de detectar contenido inapropiado. Amazon Rekognition también ofrece análisis y reconocimiento facial de alta precisión en las imágenes y los videos que usted suministre. Puede detectar, analizar y comparar rostros para una amplia variedad de casos de uso de verificación de usuarios, contabilización de personas y seguridad pública.

#### WS Identity and Access Management (IAM)
Con AWS Identity and Access Management (IAM) puede administrar el acceso a los servicios y recursos de AWS de manera segura. Además, puede crear y administrar usuarios y grupos de AWS, así como utilizar permisos para conceder o negar el acceso de estos a los recursos de AWS.

##### IAM Usuarios Implementados
- **Administrador_201503984**: Usuario creado para trabajar en la práctica, usando la política de administrador que proporciona aws.

##### Roles Utilizados
- **DynamoDB-W-FULL**: Rol creado para la base de datos no SQL, para este rol utlizamos la política AmazonDynamoDBFullAccess y creamos una política llamada dynamodb-write-item, la cual tiene permisos de escritura a la base de datos. 
- **lambda_basic_execution**: Rol creado para usar rekognition, el cual lo utilizamos en una función lambda, utilizando la política AmazonRekognitionFullAccess.

##### Funciones Lambda

- **getMyPhotos**: En esta funcion lambda se le envia como parametro de entrada el nombre del usuario, y devuelve la direccion url de la imagen que
proporciona como resultado de la busqueda de todas las fotos donde aparece. 

- **getPhotosCategory**: En esta funcion lambda se le envia como parametro de entrada el nombre del usuario, y devuelve la categoria a la que pertenece
la imagen evaluada y la direccion url de la imagen. Esta respuesta es proporciona como resultado de la busqueda de todas las fotos que ha subido a la
plataforma el usuario.

- **getAllPhotos**: En esta funcion lambda se le envia como parametro de entrada el nombre del usuario, y devuelve la direccion url de la imagen que
proporciona como resultado la busqueda de todas las fotos que ha subido el usuario a la plataforma. 

## Autores
#### **201503984** Fernando Vidal Ruíz Piox
#### **201602975** Ruth Nohemy Ardón Lechuga
