# 💎 Tienda de Joyas - API REST

Aplicación **backend con Node.js y Express** conectada a una base de datos **PostgreSQL**, que permite consultar, filtrar y paginar un inventario de joyas.

La API ofrece funcionalidades avanzadas como **orden dinámico**, **paginación**, **filtros por query string** y respuestas en formato **HATEOAS**. Las consultas están protegidas contra **inyecciones SQL** mediante parámetros seguros.

---

## 🛠️ Tecnologías usadas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-black?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 ¿Cómo usarlo?

### ▶️ Clonar y ejecutar el proyecto

```bash
git clone https://github.com/Genesisdeabreu/tienda-de-joyas.git
cd tienda-de-joyas
npm install
node index.js
```

---

### 📁 Estructura del proyecto

- **index.js**: Servidor principal con rutas /joyas y /joyas/filtros
- **controllers/joyasController.js**: Lógica de negocio y conexión con la base de datos
- **db/config.js**: Configuración de PostgreSQL con variables de entorno
- **.env**: Datos de conexión sensibles (no incluidos en el repositorio)
- **.gitignore**: Exclusión de carpetas como node_modules y archivos .env

---

### 📌 Funcionalidades del CRUD

1. **GET /joyas**: Devuelve una lista paginada y ordenada de joyas, con estructura HATEOAS. Parámetros: limits, page, order_by
2. **GET /joyas/filtros**: Filtra las joyas por precio_min, precio_max, categoria y/o metal

---

### 📋 Requerimientos cumplidos del desafío

1. Configuración de servidor Express ✅
2. Conexión a PostgreSQL mediante pg ✅
3. Consultas seguras con parámetros ($1, $2, etc.) ✅
4. Filtros dinámicos y orden personalizado ✅
5. Implementación de HATEOAS ✅
6. Middleware personalizado para logging (opcional) ✅
7. Control de errores con try/catch ✅

---

### 👩‍💻 Autor

**Génesis de Abreu**  
_Desarrolladora Frontend Junior_ 💻🚀✨  
[GitHub](https://github.com/Genesisdeabreu)
