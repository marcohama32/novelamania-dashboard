<template>
  <div>
    <div v-if="isAuthenticated" class="fullcontent">
      <div class="container-scroller">
        <div><TopBar /></div>
        <!-- partial -->
        <div class="container-fluid page-body-wrapper">
          <SideBar />
          <!-- partial -->
          <div class="main-panel">
            <div class="content-wrapper">
              <div class="">
                <router-view
                  v-if="
                    isAuthenticated &&
                    !isLoginRoute &&
                    !isResetRoute &&
                    !isForgetRoute
                  "
                ></router-view>
              </div>
            </div>
            <!-- content-wrapper ends -->
            <FooterPage />
            <!-- partial -->
          </div>
          <!-- main-panel ends -->
        </div>
        <!-- page-body-wrapper ends -->
      </div>
      <!-- container-scroller -->
    </div>
    <div v-else>
      <!-- Redirect when not authenticated -->
      <router-view v-if="isResetRoute || isForgetRoute || isNotFound"></router-view>

      <!-- Show login route if not accessing reset route -->
      <router-view v-else-if="isLoginRoute"></router-view>
    </div>
  </div>
</template>

<script>
import TopBar from "./pages/common/TopBar.vue";
import FooterPage from "./pages/common/FooterPage.vue";
import Cookies from "js-cookie";
import SideBar from "./pages/common/SideBar.vue";

export default {
  name: "App",
  components: {
    TopBar,
    FooterPage,
    SideBar,
  },
  computed: {
    isAuthenticated() {
      const token = Cookies.get("token");
      return !!token && this.isTokenValid(token);
    },
    isLoginRoute() {
      return this.$route.name === "Login";
    },
    isResetRoute() {
      return this.$route.name === "Reset Token";
    },
    isForgetRoute() {
      return this.$route.name === "Forget Password";
    },
    isNotFound(){
      return this.$route.name === "NotFound";
    }
  },
  methods: {
    isTokenValid(token) {
      if (!token) {
        return false;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));

        // Check if the token is expired
        const expiration = decodedToken?.exp;
        const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

        return currentTime < expiration;
      } catch (error) {
        console.error("Invalid token format");
        return false;
      }
    },
  },
};
</script>
