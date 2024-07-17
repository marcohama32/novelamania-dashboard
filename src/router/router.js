import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";
// import axios from "axios";
import Login from "@/pages/common/LogIn.vue";
import Home from "@/pages/common/HomePage.vue";

import NotFound from "@/pages/common/NotFound.vue";


// -----------------------------------------------------------------------
// content
import AddContent from "@/pages/content/AddContent.vue";
import ViewContent from "@/pages/content/ViewContent.vue";
import EditContent from "@/pages/content/EditContent.vue";

// season
import AddSeason from "@/pages/content/Seasons/AddSeason.vue";
import ViewSeason from "@/pages/content/Seasons/ViewSeason.vue";
import EditSeason from "@/pages/content/Seasons/EditSeason.vue";

// livros
import AddLivros from "@/pages/livros/AddLivros.vue";
import ViewLivros from "@/pages/livros/ViewLivros.vue";

// pacotes
import AddPacotes from "@/pages/pacotes/AddPacotes.vue";
import ViewPacotes from "@/pages/pacotes/ViewPacotes.vue";
import SubscreverPacote from "@/pages/pacotes/SubscreverPacote.vue";
import EditPacote from "@/pages/pacotes/EditPacotes.vue";

// clientes
import AddClientes from "@/pages/clientes/AddClientes.vue";
import ViewClientes from "@/pages/clientes/ViewClientes.vue";
import EditCliente from "@/pages/clientes/EditCliente.vue";

// usuarios
import AddUsuarios from "@/pages/usuarios/AddUsuarios.vue";
import ViewUsuarios from "@/pages/usuarios/ViewUsuarios.vue";
import EditUser from "@/pages/usuarios/EditUsuarios.vue";

//perfil


// episode
import ViewEpisodes from "@/pages/content/Episodes/ViewEpisodes.vue";
import EditEpisode from "@/pages/content/Episodes/EditEpisode.vue";

const routes = [
  {
    path: "/",
    component: Home,
    name: "Dashboard",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  // content
  {
    path: "/addcontent",
    component: AddContent,
    name: "Add Content",
    meta: { requiresAuth: true, roles: ["1"] },
  },

  {
    path: "/viewcontent",
    component: ViewContent,
    name: "View Content",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/editcontent/:id",
    component: EditContent,
    name: "Edit Content",
    meta: { requiresAuth: true, roles: ["1"] },
  },

  // Season
  {
    path: "/addseason/:id",
    component: AddSeason,
    name: "Add Season",
    meta: { requiresAuth: true, roles: ["1"] },
  },

  {
    path: "/viewseason/:id",
    component: ViewSeason,
    name: "View Season",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/editseason/:id",
    component: EditSeason,
    name: "Edit Season",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  // Episodes
  {
    path: "/viewepisodes/:id",
    component: ViewEpisodes,
    name: "View Episode",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/editepisode/:id",
    component: EditEpisode,
    name: "Edit Episode",
    meta: { requiresAuth: true, roles: ["1"] },
  },

  // livros
  {
    path: "/addlivros",
    component: AddLivros,
    name: "Add Livros",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/viewlivros",
    component: ViewLivros,
    name: "View Livros",
    meta: { requiresAuth: true, roles: ["1"] },
  },

  // pacotes
  {
    path: "/addpacotes",
    component: AddPacotes,
    name: "Add Pacotes",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/editpacote/:id",
    component: EditPacote,
    name: "Edit Pacote",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/viewpacotes",
    component: ViewPacotes,
    name: "View Pacotes",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/subscreverpacote/:id",
    component: SubscreverPacote,
    name: "Subscrever Pacote",
    meta: { requiresAuth: true, roles: ["1"] },
  },

  // clientes
  {
    path: "/addclientes",
    component: AddClientes,
    name: "Add Clientes",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/viewclientes",
    component: ViewClientes,
    name: "View Clientes",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/editcliente/:id",
    component: EditCliente,
    name: "Edit Cliente",
    meta: { requiresAuth: true, roles: ["1"] },
  },

  // usuario
  {
    path: "/addusuarios",
    component: AddUsuarios,
    name: "Add Usuarios",
    meta: { requiresAuth: true, roles: ["1"] },
  },

  {
    path: "/viewusuarios",
    component: ViewUsuarios,
    name: "View Usuarios",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  {
    path: "/edituser/:id",
    component: EditUser,
    name: "Edit User",
    meta: { requiresAuth: true, roles: ["1"] },
  },
  // 


  // Login & Logout
  {
    path: "/login",
    name: "Login",
    components: {
      default: Login,
      login: Login,
    },
    meta: { requiresAuth: false },
  },
  // {
  //   path: "/reset/:token",
  //   name: "Reset Token",
  //   component: Reset,
  //   meta: { requiresAuth: false }, // Make sure this is set to false
  // },
  // {
  //   path: "/forget-password",
  //   name: "Forget Password",
  //   component: Forget,
  // },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = Cookies.get("token");
  const userRole = Cookies.get("role");
  const path = to.name;

  // Redirecionar para a página de login se não autenticado e a rota for NotFound
  if (!isAuthenticated && path === "NotFound") {
    return next({ name: "Login" });
  }

  // Verificar a validade do token se autenticado
  // let tokenValid = false;
  // if (isAuthenticated) {
  //   tokenValid = await isTokenValid(isAuthenticated);
  // }

  // Redirecionar para a página de login se a rota requer autenticação e o token não for válido
  if (
    (to.meta.requiresAuth && !isAuthenticated)
  ) {
    clearUserData();
    return next({ path: "/login" });
  }

  // Redirecionar para a página de login se o role do usuário for diferente de 1
  if (userRole !== "1" && to.name !== "Login") {
    clearUserData();
    return next({ path: "/login" });
  }

  // Verificar se a rota requer uma role específica e o usuário não possui
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return next({ name: "NotFound" });
  }

  // Resetar o timer de auto-logout se autenticado
  if (isAuthenticated) {
    resetAutoLogoutTimer();
  }

  // Permitir a navegação para a próxima rota
  next();
});

// Definir as funções de timer de auto-logout
let autoLogoutTimer;

function resetAutoLogoutTimer() {
  clearTimeout(autoLogoutTimer);
  autoLogoutTimer = setTimeout(() => {
    clearUserData(); // Executar ações de logout
    window.location.replace("/login");
  }, 900000); // 15 minutos (900,000 milissegundos)
}

function clearUserData() {
  Cookies.remove("token");
  Cookies.remove("role");
  sessionStorage.removeItem("visitedBefore");
}

// Verificar se o token é válido
// async function isTokenValid(token) {
//   try {
//     const response = await axios.get("/api/check/verify-token/", {
//       headers: {
//         token: token,
//       },
//     });
//     return response.status === 200; // Retornar true se o token for válido
//   } catch (error) {
//     return false; // Retornar false se o token for inválido ou a solicitação falhar
//   }
// }

export default router;
