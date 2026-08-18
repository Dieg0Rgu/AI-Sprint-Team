import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './Router' // Mantenemos la R mayúscula si decides no renombrar la carpeta

// 1. Instanciamos la aplicación guardándola en la variable 'app'
const app = createApp(App)

// 2. Registramos el enrutador ANTES de montar la app en el HTML
app.use(router)

// 3. Montamos la aplicación en el DOM
app.mount('#app')
