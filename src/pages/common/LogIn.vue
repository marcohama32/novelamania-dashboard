<template>
  <div>
    <!-- <div class="text-center mb-4">
      <button
        type="submit"
        class="btn btn-primary btn-block"
        :disabled="btnLoading"
      >
        <div v-if="btnLoading" class="spinner-border spinner-border-sm"></div>
        <span v-if="btnLoading">Processando</span>
        <span v-else>Entrar</span>
      </button>
    </div> -->

    <!--  -->
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth">
          <div class="row flex-grow">
            <div class="col-lg-4 mx-auto">
              <div class="auth-form-light text-center p-5">
                <div class="brand-logo">
                  <img
                    src="/assets/images/logo Max Size.png"
                    style="width: 80px; height: auto"
                    alt="Logo"
                  />
                </div>
                <h4>Olá! vamos começar</h4>
                <h6 class="font-weight-light">Faça login para continuar.</h6>
                <form class="pt-3" @submit.prevent="onLogin">
                  <div class="form-group">
                    <input
                      v-model="contact1"
                      type="number"
                      class="form-control form-control-lg"
                      id="exampleInputEmail1"
                      placeholder="Contacto"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      v-model="password"
                      type="password"
                      class="form-control form-control-lg"
                      id="exampleInputPassword1"
                      placeholder="Senha"
                    />
                  </div>
                  <div class="mt-3">
                    <button
                      class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                      :disabled="btnLoading"
                      @click="signIn"
                    >
                      <span v-if="!btnLoading">SIGN IN</span>
                      <span v-else>
                        <span
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing in...
                      </span>
                    </button>
                    <!-- <button
                      class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                      :disabled="btnLoading"
                    >
                      SIGN IN
                    </button> -->
                  </div>
                  <div
                    class="my-2 d-flex justify-content-between align-items-center"
                  >
                    <router-link
                      to="/forget-password"
                      class="auth-link text-black"
                      >Forgot password?</router-link
                    >
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- content-wrapper ends -->
      </div>
      <!-- page-body-wrapper ends -->
    </div>
    <!--  -->
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";

export default {
  data() {
    return {
      contact1: "",
      password: "",
      btnLoading: false,
      loading: false,
      errors: {},
    };
  },
  computed: {
    axiosBaseUrl() {
      return axios.defaults.baseURL;
    },
  },
  created() {
    this.axios = axios; // Create a reference to axios
  },
  methods: {
    async onLogin() {
      this.btnLoading = true;
      // Verificar se ambos os campos de contacto e senha estão vazios
      if (!this.contact1 || !this.password) {
        Swal.fire({
          icon: "warning",
          title: "Aviso!",
          toast: true,
          text: "Contacto e senha são obrigatórios.",
          timer: 3000,
          showConfirmButton: false,
          position: "top-end",
        });
        return;
      }

      // Validar o campo de contacto
      if (!/^258\d{9}$/.test(this.contact1)) {
        Swal.fire({
          icon: "warning",
          title: "Aviso!",
          toast: true,
          text: "O contacto deve iniciar com 258 e ter 12 dígitos.",
          timer: 3000,
          showConfirmButton: false,
          position: "top-end",
        });
        return;
      }

      try {
        // this.loading = true;
        this.btnLoading = false;

        const user = {
          contact1: this.contact1,
          password: this.password,
        };

        // Certifique-se de que axios está configurado corretamente
        const res = await axios.post("/api/signin", user);

        if (res.status === 200) {
          Cookies.set("token", res.data.token, { expires: 7 });
          Cookies.set("role", res.data.role, { expires: 7 });
          this.isLoggedIn = true; // Atualizar o estado de login

          this.$emit("loginSuccess");
          // this.$router.push("/");
          location.reload();
        }
      } catch (error) {
        console.error("Erro na requisição:", error); // Log para depuração

        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          this.errors = { username: [error.response.data.error] };
          Swal.fire({
            icon: "warning",
            title: "Aviso!",
            toast: true,
            text: this.errors.username,
            timer: 3000,
            showConfirmButton: false,
            position: "top-end",
          });
        } else {
          // Exibir uma mensagem de erro genérica para erros inesperados
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Um erro ocorreu. Por favor, tente novamente mais tarde.",
          });
        }
      } finally {
        this.loading = false;
        this.btnLoading = false;
      }
    },
    // async onLogin() {
    //   // Check if both email and password fields are empty
    //   if (!this.username || !this.password) {
    //     Swal.fire({
    //       icon: "warning",
    //       title: "Aviso!",
    //       toast: true,
    //       text: "Usuario e senha são obrigatórios.",
    //       timer: 3000,
    //       showConfirmButton: false,
    //       position: "top-end",
    //     });
    //     return;
    //   }

    //   try {
    //     this.loading = true;
    //     this.btnLoading = true;

    //     const user = {
    //       username: this.username,
    //       password: this.password,
    //     };

    //     const res = await this.axios.post("/api/signin", user);

    //     if (res.status === 200) {
    //       Cookies.set("token", res.data.token, { expires: 7 });
    //       Cookies.set("role", res.data.role, { expires: 7 });
    //       this.$emit("loginSuccess");
    //       this.$router.go("/");
    //     }
    //   } catch (error) {
    //     if (
    //       error.response &&
    //       error.response.data &&
    //       error.response.data.error
    //     ) {
    //       this.errors = { username: [error.response.data.error] };
    //       console.log(this.errors);
    //       Swal.fire({
    //         icon: "warning",
    //         title: "Aviso!",
    //         toast: true,
    //         text: `${this.errors.username}`,
    //         timer: 3000,
    //         showConfirmButton: false,
    //         position: "top-end",
    //       });
    //     } else {
    //       // Show a generic error message for unexpected errors
    //       Swal.fire({
    //         icon: "error",
    //         title: "Erro!",
    //         text: "Um erro ocorreu. Por favor, tente novamente mais tarde.",
    //       });
    //     }
    //   } finally {
    //     this.loading = false;
    //     this.btnLoading = false;
    //   }
    // },
  },

  beforeRouteEnter(to, from, next) {
    const isAuthenticated = Cookies.get("token");
    if (isAuthenticated) {
      next({ name: "Dashboard" });
    } else {
      next();
    }
  },
};
</script>

<style>
.titlementor {
  color: #148abe;
  margin-top: 40px;
  opacity: 0.3;
}
.account-info-area {
  background-color: #ffffff !important;
  /* color: #fafafa !important; */
}
.image-container img {
  /* max-width: 50%; */
  opacity: 0.8;
  /* margin-top: 20px; */
  /* width: 50%; */
}
.spinner {
  width: 2em;
  height: 2em;
  border-top: 1em solid #99a0ac;
  border-right: 1em solid transparent;
  border-radius: 100%;
  margin: auto;
  animation: spinner 0.9s linear infinite;
}
@keyframes spinner {
  100% {
    transform: rotate(360deg);
  }
}
</style>
