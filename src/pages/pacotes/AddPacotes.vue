<template>
    <div>
      <div class="row">
        <div class="col-md-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Adicionar Pacote</h4>
              <form
                class="forms-sample mt-4"
                @submit.prevent="onCreateCustomer"
                enctype="multipart/form-data"
              >
                <div class="row mb-3">
                  <div class="col-md-4 mb-3">
                    <label for="release_year">Nome</label>
                    <input
                      type="text"
                      class="form-control"
                      id="nome"
                      placeholder="Nome"
                      v-model="name"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="genres">Duracao</label>
                    <input
                      type="number"
                      class="form-control"
                      id="duracao"
                      placeholder="duracao em dias"
                      v-model="durationInDays"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="genres">Preco</label>
                    <input
                      type="number"
                      class="form-control"
                      id="preco"
                      placeholder="preco"
                      v-model="price"
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
        name: "",
        durationInDays: "",
        price: "",
  
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
  
        const requiredFields = [
          "name",
          "durationInDays",
          "price",
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
          formData.append("name", this.name);
          formData.append("durationInDays", this.durationInDays);
          formData.append("price", this.price);
  
          this.btnloading = true;
          const response = await axios.post("api/package/create", formData, {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          });
          console.log(response);
  
          Toast.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Pacote criado com sucesso",
            timer: 3000,
          });
  
          this.btnloading = false;
          this.$router.push("/viewpacotes");
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
  