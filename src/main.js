import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
import VueCookies from "vue-cookies";
import Cookies from "js-cookie";
import router from "./router/router";
import store from "./store/store";

// import "../public/assets/vendors/mdi/css/materialdesignicons.min.css"
// import "../public/assets/vendors/css/vendor.bundle.base.css"
// import "../public/assets/css/style.css"

// Import the Flatpickr CSS

// Set default base URL for Axios requests
axios.defaults.baseURL = "https://novelamania-api.onrender.com";
// axios.defaults.baseURL = "http://localhost:8000";

// Adicionando o interceptor para tratamento de erros de autorização (401)
let isHandlingUnauthorized = false;

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response && error.response.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true; // Indica que o erro 401 está sendo tratado

      const token = Cookies.get("token");
      try {
        if (token) {
          const verifyResponse = await axios.get("/api/check/verify-token", {
            headers: {
              token: token,
            },
          });

          // Se o token for inválido, realiza o logout
          if (!verifyResponse.data.valid) {
            await performLogout(token);
          }
        } else {
          await performLogout();
        }
      } catch (verifyTokenError) {
        console.error("Erro ao verificar token:", verifyTokenError);
        await performLogout(token);
      } finally {
        isHandlingUnauthorized = false; // Reseta a flag após tratar o erro
      }
    }
    return Promise.reject(error);
  }
);

async function performLogout(token) {
  try {
    if (token) {
      await axios.get("/api/logout", {
        headers: {
          token: token,
        },
      });
    }
  } catch (logoutError) {
    console.error("Erro ao realizar logout:", logoutError);
  } finally {
    Cookies.remove("token");
    Cookies.remove("role");
    VueCookies.remove("token");
    router.push("/");
  }
}



const app = createApp(App);

app.use(VueCookies);
app.use(router);
app.use(store);

// Register the NotificationComponent globally to use it in any part of the app
// app.component("notification-component", NotificationComponent);

// Create a socket connection
// const socket = io("ws://localhost:8000", {
//   transports: ["websocket", "polling", "flashsocket"],
// }); // Replace with your server's URL

// Add the socket to the Vue app's prototype
// app.config.globalProperties.$socket = socket;

// Track socket connection status
// app.config.globalProperties.$socketStatus = "connecting";

// socket.on("connect", () => {
//   console.log("Socket connected");
//   app.config.globalProperties.$socketStatus = "connected";
// });

// socket.on("disconnect", () => {
//   console.log("Socket disconnected");
//   app.config.globalProperties.$socketStatus = "disconnected";
// });

app.mount("#app");
