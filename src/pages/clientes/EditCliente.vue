<template>
  <div>
    <div class="row">
      <div class="col-md-6 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Editar Cliente</h4>
            <form
              class="forms-sample mt-4"
              @submit.prevent="onUpdateCustomer"
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
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6 mb-3">
                  <label for="release_year">Data de nascimento</label>
                  <input
                    type="date"
                    class="form-control"
                    id="release_year"
                    placeholder="Ano"
                    v-model="dob"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="genres">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="exampleInputEmail1"
                    placeholder="Gênero"
                    v-model="email"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6 mb-3">
                  <label for="type">Genero</label>
                  <select v-model="gender" class="form-control" id="type">
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Femenino</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="type">Provincia</label>
                  <select v-model="province" class="form-control" id="type">
                    <option value="Niassa">Niassa</option>
                    <option value="Cabo-Delgado">Cabo Delgado</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Zambezia">Zambézia</option>
                    <option value="Tete">Tete</option>
                    <option value="Manica">Manica</option>
                    <option value="Sofala">Sofala</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Gaza">Gaza</option>
                    <option value="Maputo">Maputo</option>
                    <option value="Matola">Matola</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6 mb-3">
                  <label for="type">Contacto</label>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="senha"
                    v-model="contact1"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="type">Senha</label>
                  <input
                    type="password"
                    class="form-control"
                    placeholder="senha"
                    v-model="password"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  class="btn btn-gradient-primary mr-2"
                  v-if="!btnloading"
                >
                  Salvar
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
                  Salvando...
                </button>
                <button type="button" @click="goBack" class="btn btn-light">Cancelar</button>
              </div>
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
    goBack() {
      this.$router.go(-1);
    },
    getFilePath(file) {
      return `${axios.defaults.baseURL}/${file}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}`;
    },
    formatDateEdit(dateString) {
      const date = new Date(dateString); // Create a Date object from the ISO 8601 date string
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and pad with '0' if needed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`; // Return the formatted date as a string
    },
    async fetchData() {
      try {
        this.loading = true;

        const token = Cookies.get("token");

        const id = this.$route.params.id;

        const response = await axios.get(`/api/user/getuserbyid/${id}`, {
          headers: {
            token: token,
          },
        });

        this.contents = response.data.user;

        this.firstName = this.contents.firstName;
        this.lastName = this.contents.lastName;
        this.dob = this.formatDateEdit(this.contents.dob);
        this.email = this.contents.email;
        this.contact1 = this.contents.contact1;
        this.gender = this.contents.gender;
        this.province = this.contents.province;
        this.status = this.contents.status;
        this.password = this.contents.password;

        // console.log(response.data.transactions);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    onFileChange(event) {
      const file = event.target.files[0]; // Get the selected file
      this.image_url = file; // Set the file object to the image_url property
    },
    async onUpdateCustomer() {
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

      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "gender",
        "dob",
        "province",
        "contact1",
        "status",
      ];
      const token = Cookies.get("token");
      for (const field of requiredFields) {
        if (this[field] === "") {
          Swal.fire({
            icon: "warning",
            title: "Aviso!",
            toast: true,
            text: `Campos não podem estar vazios`,
            timer: 3000,
            showConfirmButton: false,
            position: "top-end",
          });
          return;
        }
      }

      try {
        const role = 2;
        const formData = new FormData();
        formData.append("firstName", this.firstName);
        formData.append("lastName", this.lastName);
        formData.append("email", this.email);
        formData.append("gender", this.gender);
        formData.append("dob", this.dob);
        formData.append("province", this.province);
        formData.append("contact1", this.contact1);
        formData.append("role", role);
        formData.append("password", this.password);

        const id = this.$route.params.id;

        await axios.put(`/api/user/updateuser/${id}`, formData, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });

        Toast.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Cliente actualizado com sucesso",
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
