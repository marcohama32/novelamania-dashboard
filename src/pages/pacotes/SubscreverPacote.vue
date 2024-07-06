<template>
  <div>
    <div class="row">
      <div class="col-md-6 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Alocar Pacote</h4>
            <form
              class="forms-sample mt-4"
              @submit.prevent="onSubscribPackage"
              enctype="multipart/form-data"
            >
              <div class="row mb-3">
                <div class="col-md-6 mb-3">
                  <label for="release_year">Nome</label>
                  <input
                    type="text"
                    class="form-control"
                    id="release_year"
                    placeholder="Nome"
                    v-model="firstName"
                    disabled
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="genres">Apelido</label>
                  <input
                    type="text"
                    class="form-control"
                    id="genres"
                    placeholder="apelido"
                    v-model="lastName"
                    disabled
                  />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6 mb-3">
                  <label for="type">Contacto</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="senha"
                    v-model="contact1"
                    disabled
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="package">Pacotes</label>
                  <select
                    v-model="packageId"
                    class="form-control"
                    id="package"
                    @change="logPackageId"
                  >
                    <option value="" disabled>Selecione um pacote</option>
                    <option
                      v-for="pacote in pacotes"
                      :key="pacote.id"
                      :value="pacote._id"
                    >
                      {{ pacote.name }} - {{ pacote.price }} MT - {{ pacote.durationInDays }} Dias
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  class="btn btn-gradient-primary mr-2"
                  v-if="!btnloading"
                >
                  Subscrever
                </button>
                <button
                  type="button"
                  class="btn btn-gradient-primary mr-2"
                  disabled
                  v-if="btnloading"
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Subscrevendo...
                </button>
              </div>

              <button type="button" @click="goBack" class="btn btn-light">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
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
      contents: [],
      pacotes: [],
      packageId: "",
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      dob: "",
      province: "",
      contact1: "",
      password: "",
      loading: false,
      btnloading: false,
    };
  },
  methods: {
    logPackageId() {
      //   console.log("Package ID selecionado:", this.packageId); // Adicionar log para verificar packageId
    },
    goBack() {
      this.$router.go(-1);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
    },
    formatDateEdit(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    async fetchData() {
      try {
        this.loading = true;
        const token = Cookies.get("token");
        const id = this.$route.params.id;

        const response = await axios.get(`/api/user/getuserbyid/${id}`, {
          headers: { token: token },
        });

        this.contents = response.data.user;
        // console.log("User Data:", this.contents); // Adicionar log para verificar dados do usuário

        const p = await axios.get("/api/package/getall", {
          headers: { token: token },
        });

        this.pacotes = p.data.packages;
        // console.log("Pacotes Data:", this.pacotes); // Adicionar log para verificar pacotes

        this.firstName = this.contents.firstName;
        this.lastName = this.contents.lastName;
        this.dob = this.formatDateEdit(this.contents.dob);
        this.email = this.contents.email;
        this.contact1 = this.contents.contact1;
        this.gender = this.contents.gender;
        this.province = this.contents.province;
        this.status = this.contents.status;
        this.password = this.contents.password;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async onSubscribPackage() {
      this.btnloading = true;
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      const requiredFields = ["packageId"];
      const token = Cookies.get("token");

      for (const field of requiredFields) {
        if (this[field] === "") {
          Swal.fire({
            icon: "warning",
            title: "Aviso!",
            toast: true,
            text: `Selecione um pacote`,
            timer: 3000,
            showConfirmButton: false,
            position: "top-end",
          });
          this.btnloading = false;
          return;
        }
      }

      try {
        const id = this.$route.params.id;
        console.log("Package ID:", this.packageId); // Adicionar log para verificar packageId
        const formData = {
          packageId: this.packageId,
          userId: id,
        };

        await axios.post("/api/package/subscribe", formData, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });

        Toast.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Pacote adicionado com sucesso",
          timer: 3000,
        });

        this.btnloading = false;
        this.$router.push("/viewclientes");
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: errorMessage,
        });
        this.btnloading = false;
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
