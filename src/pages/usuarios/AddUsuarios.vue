<template>
    <div>
      <div class="row">
        <div class="col-md-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Adicionar Usuario</h4>
              <form
                class="forms-sample mt-4"
                @submit.prevent="onCreateCustomer"
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
                  <button type="button" class="btn btn-light" @click="goBack">
                  Cancelar
                </button>
                </div>
                <!-- <button type="submit" class="btn btn-gradient-primary mr-2">
                  Salvar
                </button> -->
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from "sweetalert2/dist/sweetalert2.js";
  import "sweetalert2/dist/sweetalert2.css";
  import axios from "axios";
  import Cookies from "js-cookie";
  
  export default {
    data() {
      return {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        dob: "",
        province: "",
        contact1: "",
        password: "",
  
        btnloading: false,
        loading: false,
      };
    },
    methods: {
      onFileChange(event) {
        const file = event.target.files[0]; // Get the selected file
        this.image_url = file; // Set the file object to the image_url property
      },
      goBack() {
        this.$router.go(-1);
      },
      async onCreateCustomer() {
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
        const role = 1;
        const requiredFields = [
          "firstName",
          "lastName",
          "email",
          "gender",
          "dob",
          "province",
          "contact1",
          "role",
          "password",
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
  
          this.btnloading = true;
          const response = await axios.post("api/user/signup", formData, {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          });
          console.log(response);
  
          Toast.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Usuario criado com sucesso",
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
  };
  </script>
  