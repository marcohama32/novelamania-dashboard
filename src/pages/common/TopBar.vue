<template>
  <div>
    <nav
      class="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row"
    >
      <div
        class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center"
      >
        <router-link to="/"  class="navbar-brand brand-logo"
          >
          <img src="" alt="NovelaMania"
        />
      </router-link>
        <a class="navbar-brand brand-logo-mini" href="index-2.html"
          ><img src="/assets/images/logo-mini.svg" alt="logo"
        /></a>
      </div>
      <div class="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          class="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-toggle="minimize"
        >
          <span class="mdi mdi-menu"></span>
        </button>
        <div class="search-field d-none d-md-block">
          <!-- <form class="d-flex align-items-center h-100" action="#">
            <div class="input-group">
              <div class="input-group-prepend bg-transparent">
                <i class="input-group-text border-0 mdi mdi-magnify"></i>
              </div>
              <input
                type="text"
                class="form-control bg-transparent border-0"
                placeholder="Pesquisa"
              />
            </div>
          </form> -->
        </div>
        <ul class="navbar-nav navbar-nav-right">
          <!-- <li class="nav-item nav-profile dropdown">
            <a
              class="nav-link dropdown-toggle"
              id="profileDropdown"
              href="#"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="nav-profile-img">
                <img src="assets/images/faces/face1.jpg" alt="image" />
                <span class="availability-status online"></span>
              </div>
              <div class="nav-profile-text">
                <p class="mb-1 text-black">David Greymaax</p>
              </div>
            </a>
            <div
              class="dropdown-menu navbar-dropdown"
              aria-labelledby="profileDropdown"
            >
              <a class="dropdown-item" href="#">
                <i class="mdi mdi-cached mr-2 text-success"></i> Activity Log
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">
                <i class="mdi mdi-logout mr-2 text-primary"></i> Signout
              </a>
            </div>
          </li> -->
          <li class="nav-item d-none d-lg-block full-screen-link">
            <a class="nav-link">
              <i class="mdi mdi-fullscreen" id="fullscreen-button"></i>
            </a>
          </li>
          <!-- <li class="nav-item dropdown">
            <a
              class="nav-link count-indicator dropdown-toggle"
              id="messageDropdown"
              href="#"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="mdi mdi-email-outline"></i>
              <span class="count-symbol bg-warning"></span>
            </a>
            <div
              class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"
              aria-labelledby="messageDropdown"
            >
              <h6 class="p-3 mb-0">Messages</h6>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                  <img
                    src="assets/images/faces/face4.jpg"
                    alt="image"
                    class="profile-pic"
                  />
                </div>
                <div
                  class="preview-item-content d-flex align-items-start flex-column justify-content-center"
                >
                  <h6 class="preview-subject ellipsis mb-1 font-weight-normal">
                    Mark send you a message
                  </h6>
                  <p class="text-gray mb-0">1 Minutes ago</p>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                  <img
                    src="assets/images/faces/face2.jpg"
                    alt="image"
                    class="profile-pic"
                  />
                </div>
                <div
                  class="preview-item-content d-flex align-items-start flex-column justify-content-center"
                >
                  <h6 class="preview-subject ellipsis mb-1 font-weight-normal">
                    Cregh send you a message
                  </h6>
                  <p class="text-gray mb-0">15 Minutes ago</p>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                  <img
                    src="assets/images/faces/face3.jpg"
                    alt="image"
                    class="profile-pic"
                  />
                </div>
                <div
                  class="preview-item-content d-flex align-items-start flex-column justify-content-center"
                >
                  <h6 class="preview-subject ellipsis mb-1 font-weight-normal">
                    Profile picture updated
                  </h6>
                  <p class="text-gray mb-0">18 Minutes ago</p>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <h6 class="p-3 mb-0 text-center">4 new messages</h6>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link count-indicator dropdown-toggle"
              id="notificationDropdown"
              href="#"
              data-toggle="dropdown"
            >
              <i class="mdi mdi-bell-outline"></i>
              <span class="count-symbol bg-danger"></span>
            </a>
            <div
              class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"
              aria-labelledby="notificationDropdown"
            >
              <h6 class="p-3 mb-0">Notifications</h6>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                  <div class="preview-icon bg-success">
                    <i class="mdi mdi-calendar"></i>
                  </div>
                </div>
                <div
                  class="preview-item-content d-flex align-items-start flex-column justify-content-center"
                >
                  <h6 class="preview-subject font-weight-normal mb-1">
                    Event today
                  </h6>
                  <p class="text-gray ellipsis mb-0">
                    Just a reminder that you have an event today
                  </p>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                  <div class="preview-icon bg-warning">
                    <i class="mdi mdi-settings"></i>
                  </div>
                </div>
                <div
                  class="preview-item-content d-flex align-items-start flex-column justify-content-center"
                >
                  <h6 class="preview-subject font-weight-normal mb-1">
                    Settings
                  </h6>
                  <p class="text-gray ellipsis mb-0">Update dashboard</p>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                  <div class="preview-icon bg-info">
                    <i class="mdi mdi-link-variant"></i>
                  </div>
                </div>
                <div
                  class="preview-item-content d-flex align-items-start flex-column justify-content-center"
                >
                  <h6 class="preview-subject font-weight-normal mb-1">
                    Launch Admin
                  </h6>
                  <p class="text-gray ellipsis mb-0">New admin wow!</p>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <h6 class="p-3 mb-0 text-center">See all notifications</h6>
            </div>
          </li>
          <li class="nav-item nav-logout d-none d-lg-block">
            <a class="nav-link" href="#">
              <i class="mdi mdi-power"></i>
            </a>
          </li>
          <li class="nav-item nav-settings d-none d-lg-block">
            <a class="nav-link" href="#">
              <i class="mdi mdi-format-line-spacing"></i>
            </a>
          </li> -->
        </ul>
        <button
          class="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-toggle="offcanvas"
        >
          <span class="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      showMobileMenu: false,
      avatar: null,
      routeName: null,
      firstName: "",
      lastName: "",
      role: "",
      ogv: null,
      userID: "",
      notifications: [], // Array to hold notifications
      showNotificationsDropdown: false, // Control the visibility of the dropdown
    };
  },
  computed: {
    reversedNotifications() {
      // Reverse the order of notifications
      return this.notifications.slice().reverse();
    },
    currentRouteName() {
      return this.$route.name;
    },
    filteredRoutes() {
      try {
        const isAuthenticated = Cookies.get("token");
        const userRole = Cookies.get("role");

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
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    toggleMobileMenu() {
      console.log("toggleMobileMenu called");
      this.showMobileMenu = !this.showMobileMenu; // Alterna entre abrir e fechar o menu móvel
    },
    closeMobileMenu() {
      console.log("closeMobileMenu called");
      this.showMobileMenu = false; // Fecha o menu móvel
    },

    async profile() {
      try {
        this.loading = true;

        const token = Cookies.get("token");
        const response = await axios.get("/api/me", {
          headers: {
            token: token,
          },
        });

        if (response) {
          //  const totalTransactions = response.data.totalTransactions;
          const profile = response.data.user;
          this.firstName = profile.firstName;
          this.role = profile.role;
        } else {
          console.error("erro");
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString); // Create a Date object from the ISO 8601 date string
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and pad with '0' if needed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`; // Return the formatted date as a string
    },
    getStatusClass(status) {
      if (status === "Active") {
        return "text-success";
      } else if (status === "Inactive") {
        return "text-danger";
      } else {
        return ""; // Default class if no match
      }
    },
    async logout() {
      try {
        // Remove cookies and session storage data
        Cookies.remove("token");
        Cookies.remove("role");
        sessionStorage.removeItem("visitedBefore");

        this.$router.go("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    getAvatarUrl() {
      if (this.avatar) {
        // Use the configured base URL and ensure forward slashes in the avatar path
        return `${axios.defaults.baseURL}/${this.avatar.replace(/\\/g, "/")}`;
      }
      // Use an absolute path or root-relative path for the default image URL
      return `${axios.defaults.baseURL}/path/to/default/image/logow.png`; // Replace with your default image path
    },
    hasRoute(routeName) {
      const hasRoute = this.filteredRoutes.some(
        (route) => route.name === routeName
      );
      return hasRoute;
    },
  },
  created() {
    this.profile();
  },
  mounted() {
    // Código JavaScript para o menu móvel
    if ($(".mobile-menu").length) {
      $(".mobile-menu .menu-box .menu-outer").append(
        $(".menu-area .main-menu").html()
      );

      $(".mobile-menu li.menu-item-has-children .dropdown-btn").on(
        "click",
        function () {
          $(this).toggleClass("open");
          $(this).prev("ul").slideToggle(500);
        }
      );

      $(".mobile-nav-toggler").on("click", function () {
        $("body").addClass("mobile-menu-visible");
      });

      $(".menu-backdrop, .mobile-menu .close-btn").on("click", function () {
        $("body").removeClass("mobile-menu-visible");
      });
    }
  },
};
</script>
