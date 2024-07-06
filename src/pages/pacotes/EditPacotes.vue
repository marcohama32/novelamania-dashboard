<template>
  <div>
    <div class="row">
      <div class="col-md-6 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Adicionar Pacote</h4>
            <form
              class="forms-sample mt-4"
              @submit.prevent="onUpdatePacote"
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
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";

export default {
  data() {
    return {
      contents: [],

      name: "",
      durationInDays: "",
      price: "",

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
    formatCurrency(value) {
      if (typeof value !== "number") {
        value = parseFloat(value);
      }
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "MZN",
      }).format(value);
    },
    async fetchData() {
      try {
        this.loading = true;

        const token = Cookies.get("token");

        const id = this.$route.params.id;

        const response = await axios.get(`/api/package/getbyid/${id}`, {
          headers: {
            token: token,
          },
        });

        this.contents = response.data.package;

        this.name = this.contents.name;
        this.durationInDays = this.contents.durationInDays;
        this.price = this.contents.price;

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
    async onUpdatePacote() {
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

      const requiredFields = ["name", "durationInDays", "price"];
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

        const id = this.$route.params.id;

        await axios.put(`/api/package/edit/${id}`, formData, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });

        Toast.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Pacote actualizado com sucesso",
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
  created() {
    this.fetchData();
  },
};
</script>
