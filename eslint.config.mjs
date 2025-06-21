import js from '@eslint/js'; //importamos el conjunto de reglas recomendadas para JS y proporcionadas por el propio eslint
import globals from 'globals'; //importamos el módulo global para diferentes entornos de ejecución como node.js en este caso
import { defineConfig } from 'eslint/config'; //importamos la función defineconfig para ayudar a definir la configuración de eslint
//el último import no es necesario pero si una buena práctica

export default defineConfig([
  //exportamos la config predeterminada de eslint
  {
    files: ['**/*.{js,mjs,cjs}'], //propiedad que especifica a qué s se aplicará la config
    plugins: { js }, //se definen los plugins de eslint que se utilizarán
    extends: ['js/recommended'], //esta config indica que se hereda un conjunto de reglas predefinidas
  },
  {
    files: ['**/*.{js,mjs,cjs}'], //similar al anterior, especifica que esta config se aplica a todos los archivos JS
    languageOptions: {
      //opciones relacionadas con el análisis del lenguaje
      globals: globals.node, //aquí se le dice a eslint que el entorno será Node
    },
  },
]);
