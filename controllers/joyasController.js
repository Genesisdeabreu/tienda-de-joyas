import format from 'pg-format'; //Importamos pg-format para construir consultas SQL de forma segura,
//especialmente para ORDER BY, LIMIT y OFFSET
import { pool } from '../db/config.js'; //Importamos el pool de conexiones a la base de datos desde el archivo de configuración

//Esta es la función principal para obtener joyas con opciones de: paginación, orden y límite:
export const obtenerJoyas = async ({
  limits = 10, //Cuantas joyas mostrar por página, por defecto 10
  page = 1, //Que pag de resultados mostrar, por defecto la primera
  order_by = 'id_ASC', //Como ordenar los resultados, por defecto por id ascendente
}) => {
  //Convertimos limits y page a números enteros:
  limits = parseInt(limits);
  page = parseInt(page);

  //Aseguramos que limits y page sean números válidos y positivos:
  if (isNaN(limits) || limits <= 0) limits = 10;
  if (isNaN(page) || page <= 0) page = 1;

  //Dividimos order_by en el campo a ordenar y la dirección (ASC/DESC):
  const [campo, direccion] = order_by.split('_');

  //Validación de seguridad: Esto evita que alguien intente ordenar por un campo que no existe o inyectar código:
  //Lista de campos permitidos para ordenar:
  const camposPermitidos = [
    'id',
    'nombre',
    'categoria',
    'metal',
    'precio',
    'stock',
  ];
  if (!camposPermitidos.includes(campo)) {
    throw new Error(`Campo de ordenamiento no válido: ${campo}`);
  }

  //Lista de direcciones de ordenamiento permitidas:
  const direccionesPermitidas = ['ASC', 'DESC'];
  if (!direccionesPermitidas.includes(direccion.toUpperCase())) {
    throw new Error(`Dirección de ordenamiento no válida: ${direccion}`);
  }

  //Aquí se calcula el offset: cuántos registros saltar para obtener la página correcta:
  const offset = (page - 1) * limits;

  try {
    //Primera consulta: Obtiene el TOTAL DE JOYAS en la base de datos sin importar paginación:
    const { rows: totalJoyasResult } = await pool.query(
      'SELECT COUNT(*) AS total_joyas FROM inventario'
    );
    //y convierte el resultado del conteo a un número entero:
    const totalJoyas = parseInt(totalJoyasResult[0].total_joyas);

    //Segunda consulta: Obtiene el STOCK TOTAL de todas las joyas:
    const { rows: stockTotalResult } = await pool.query(
      'SELECT SUM(stock) AS stock_total FROM inventario'
    );
    //y convierte el resultado de la suma del stock a un número entero:
    const stockTotal = parseInt(stockTotalResult[0].stock_total);

    //Tercera consulta: Obtiene las joyas aplicando la paginación y el orden
    //(Format de pg-format se usa para insertar de forma segura los valores en la consulta)
    const query = format(
      'SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s',
      campo,
      direccion.toUpperCase(), //esto asegura que la dirección sea mayúscula (ASC o DESC)
      limits,
      offset
    );

    //Ejecutamos la consulta de las joyas:
    const { rows: joyas } = await pool.query(query);

    //Pasamos las joyas obtenidas a un formato HATEOAS:
    //(HATEOAS añade enlaces para que el cliente sepa cómo interactuar con la API):
    const joyasHATEOAS = joyas.map((j) => ({
      name: j.nombre, //Mostramos el nombre de la joya.
      href: `/joyas/joya/${j.id}`, //Proporcionamos un enlace a los detalles de esa joya específica
    }));

    //Devolvemos el objeto con los totales y los resultados HATEOAS:
    return {
      totalJoyas,
      stockTotal,
      results: joyasHATEOAS,
    };
  } catch (error) {
    //Si ocurre un error en la base de datos se va a registrar en la consola:
    console.error('Error al obtener joyas en la base de datos:', error);
    //Se vuelve a lanzar el error para que la ruta en index.js lo capture y lo maneje:
    throw error;
  }
};

//Esta es la función para filtrar las joyas basándose en diferentes criterios:
export const filtrarJoyas = async (queryParams) => {
  const filtros = []; //El array para guardar las condiciones de filtro
  const valores = []; //El array para guardar los valores reales de los filtros
  let contadorParametros = 0; //Esto ayuda a crear "$1", "$2", etc., para las consultas seguras

  //Extraemos los parámetros de filtro de la solicitud:
  const { precio_min, precio_max, categoria, metal } = queryParams;

  //Si se proporciona precio_min y es un número válido:
  if (precio_min !== undefined && !isNaN(parseFloat(precio_min))) {
    contadorParametros++; //Se incrementa el contador para el siguiente parámetro
    valores.push(parseFloat(precio_min)); //Se añade el valor al array de valores
    filtros.push(`precio >= $${contadorParametros}`); //Y se añade la condición de filtro
  }

  //Si se proporciona precio_max y es un número válido:
  if (precio_max !== undefined && !isNaN(parseFloat(precio_max))) {
    contadorParametros++;
    valores.push(parseFloat(precio_max));
    filtros.push(`precio <= $${contadorParametros}`);
  }

  //Si se proporciona categoria:
  if (categoria) {
    contadorParametros++;
    valores.push(categoria);
    filtros.push(`categoria = $${contadorParametros}`);
  }

  //Si se proporciona metal:
  if (metal) {
    contadorParametros++;
    valores.push(metal);
    filtros.push(`metal = $${contadorParametros}`);
  }

  //Aquí construimos la consulta SQL base:
  let query = 'SELECT * FROM inventario';

  //Si hay filtros, los añade a la consulta usando WHERE y AND
  if (filtros.length > 0) {
    query += ' WHERE ' + filtros.join(' AND ');
  }

  try {
    //Se ejecuta la consulta de filtrado.
    //Pasamos los valores por separado para prevenir inyección SQL
    //Esto es una consulta parametrizada:
    const { rows } = await pool.query(query, valores);
    return rows; //Esto va a devolver los resultados filtrados
  } catch (error) {
    //Y si ocurre un error, lo registra y lo vuelve a lanzar:
    console.error('Error al filtrar joyas en la base de datos:', error);
    throw error;
  }
};
