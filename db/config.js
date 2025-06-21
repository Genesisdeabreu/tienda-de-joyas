import pkg from 'pg'; //Importamos el módulo pg para interactuar con PostgreSQL
import dotenv from 'dotenv'; //Importamos el módulo dotenv para cargar variables de entorno

//Cargamos todas las variables definidas en el archivo de: .env
//como PGUSER, PGPASSWORD, etc. para que estén disponibles en el código:
dotenv.config();

//Extraemos la clase pool del paquete pg. Pool: gestiona un grupo de conexiones a la base de datos:
const { Pool } = pkg;

//Vamos a crear y exportar una nueva instancia de pool que contendrá la configuración necesaria para conectarse a la bd de PostgreSQL:
export const pool = new Pool({
  //Usuario de la base de datos, obtenido de la variable de entorno PGUSER
  user: process.env.PGUSER,
  //Contraseña del usuario de la base de datos, obtenida de la variable de entorno PGPASSWORD
  password: process.env.PGPASSWORD,
  //Dirección del servidor de la base de datos, obtenida de la variable de entorno PGHOST
  host: process.env.PGHOST,
  //Nombre de la base de datos a la que conectarse, obtenida de la variable de entorno PGDATABASE
  database: process.env.PGDATABASE,
  //Puerto en el que la base de datos está escuchando, obtenido de la variable de entorno PGPORT
  port: process.env.PGPORT,
});
