import express from 'express'; //Importamos el framework Express, que nos va a ayudar a crear el servidor web
import { pool } from './db/config.js'; //Importamos el objeto pool de la config de la base de datos, lo usaremos para conectarnos
//y hacer consultas a pgSQL
import { obtenerJoyas, filtrarJoyas } from './controllers/joyasController.js'; //Importamos las funciones que se encargan de obtener y
//filtrar las joyas desde la base de datos

//Creamos una instancia de la aplicación Express:
const app = express();
//Definimos el puerto en el que el servidor va a escuchar las peticiones:
const PORT = 3000;

//Ruta base de prueba de conexión
app.get('/', async (req, res) => {
  //esta ruta es útil para saber si la conexión a la base de datos funciona
  const result = await pool.query('SELECT NOW()'); //Realizamos una consulta simple a la bd para obtener la fecha y hora actual
  res.send(`Conexión exitosa: ${result.rows[0].now}`); //Se envía una respuesta al navegador confirmando la conexión exitosa y la hora
});

//Ruta con paginación, orden y límite. Ruta para obtener las joyas:
app.get('/joyas', async (req, res) => {
  try {
    // Llamamos a la función obtenerJoyas del controlador, pasándole los parámetros de la URL (query):
    const joyas = await obtenerJoyas(req.query);
    //Enviamso las joyas obtenidas como respuesta en formato JSON:
    res.json(joyas);
  } catch (error) {
    //Si ocurre un error al obtener las joyas, lo registra en la consola del servidor:
    console.error('❌ Error en /joyas:', error);
    //Y se envía el código 500 (Error Interno del Servidor) y un mensaje de error:
    res.status(500).json({ error: 'Error al obtener las joyas' });
  }
});

//Ruta con filtros seguros y console.log. Ruta para filtrar las joyas evitando inyecciones SQL:
app.get('/joyas/filtros', async (req, res) => {
  try {
    //Registramos en la consola del servidor que se accedió a esta ruta y qué parámetros se usaron:
    //Esto sirve como un middleware simple para generar reportes:
    console.log('📥 Se accedió a /joyas/filtros con:', req.query);
    //Llamamos a la función filtrarJoyas del controlador, pasándole los parámetros de la URL:
    const joyasFiltradas = await filtrarJoyas(req.query);
    //Enviamos las joyas filtradas como respuesta en formato JSON también:
    res.json(joyasFiltradas);
  } catch (error) {
    //Si ocurre un error al filtrar las joyas, se registra en la consola del servidor:
    console.error('❌ Error en /joyas/filtros:', error);
    //Y se envía el código 500 y su mensaje:
    res.status(500).json({ error: 'Error al filtrar joyas' });
  }
});

//Iniciamos el servidor Express para que escuche las peticiones en el puerto 3000:
app.listen(PORT, () => {
  //Y aquí mostramos un mensaje en la consola indicando que el servidor está funcionando y en qué URL:
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
