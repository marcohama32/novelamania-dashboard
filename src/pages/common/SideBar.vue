<template>
  <div>
    <nav class="sidebar sidebar-offcanvas mt-4" id="sidebar">
      <ul class="nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <span class="menu-title">Dashboard</span>
            <i class="mdi mdi-home menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="collapse"
            href="#ui-basic"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <span class="menu-title">Novelas e Doramas</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-filmstrip menu-icon"></i>
          </a>
          <div class="collapse" id="ui-basic">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link to="/addcontent" class="nav-link">Add</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/viewcontent" class="nav-link"
                  >View</router-link
                >
              </li>
            </ul>
          </div>
        </li>

      

        <!-- <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="collapse"
            href="#general-pagess"
            aria-expanded="false"
            aria-controls="general-pagess"
          >
            <span class="menu-title">Livros</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-book-open-page-variant menu-icon"></i>
          </a>
          <div class="collapse" id="general-pagess">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link to="/addlivros" class="nav-link">
                  Add
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/viewlivros" class="nav-link">
                  View
                </router-link>
              </li>
            </ul>
          </div>
        </li> -->

        <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="collapse"
            href="#general-pagesss"
            aria-expanded="false"
            aria-controls="general-pagesss"
          >
            <span class="menu-title">Clientes</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-account-multiple menu-icon"></i>
          </a>
          <div class="collapse" id="general-pagesss">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link to="/addclientes" class="nav-link">
                  Add
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/viewclientes" class="nav-link">
                  View
                </router-link>
              </li>
            </ul>
          </div>
        </li>

        <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="collapse"
            href="#general-pages"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span class="menu-title">Pacotes</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-package-variant menu-icon"></i>
          </a>
          <div class="collapse" id="general-pages">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link to="/addpacotes" class="nav-link">
                  Add
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/viewpacotes" class="nav-link">
                  View
                </router-link>
              </li>
            </ul>
          </div>
        </li>

        <li class="nav-item sidebar-actions">
          <span class="nav-link">
            <div class="">
              <div class="border-bottom">
                <p class="text-secondary">Admin</p>
              </div>
            </div>
          </span>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="collapse"
            href="#general-pagessss"
            aria-expanded="false"
            aria-controls="general-pagessss"
          >
            <span class="menu-title">Usuarios</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-account menu-icon"></i>
          </a>
          <div class="collapse" id="general-pagessss">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link to="/addusuarios" class="nav-link">
                  Add
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/viewusuarios" class="nav-link">
                  View
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  computed: {
    filteredRoutes() {
      try {
        // const isAuthenticated = localStorage.getItem("token");
        // const userRole = localStorage.getItem("role");
        const isAuthenticated = Cookies.get("token"); // Retrieve token from cookie
        const userRole = Cookies.get("role"); // Retrieve role from cookie
        // Filter routes based on authentication and user role
        const routes = this.$router.options.routes;
        const filteredRoutes = routes.filter((route) => {
          if (route.meta && route.meta.requiresAuth && !isAuthenticated) {
            return false;
          }
          if (
            route.meta &&
            route.meta.roles &&
            !route.meta.roles.includes(userRole)
          ) {
            return false;
          }
          return true;
        });
        return filteredRoutes;
      } catch (error) {
        console.error("Error in filteredRoutes:", error);
        return [];
      }
    },
  },
  methods: {
    hasRoute(routeName) {
      const hasRoute = this.filteredRoutes.some(
        (route) => route.name === routeName
      );
      return hasRoute;
    },
  },
};
</script>
