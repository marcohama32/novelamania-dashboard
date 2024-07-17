<template>
  <div>
    <div class="row">
      <div class="col-md-6 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Adicionar temporada</h4>
            <form class="forms-sample mt-4" @submit.prevent="onCreateContent">
              <div class="form-group">
                <label for="title">Numero de temporada</label>
                <input
                  type="number"
                  class="form-control"
                  id="numer"
                  placeholder="Numero"
                  v-model="season_number"
                />
              </div>
              <div class="row mb-3">
                <div class="col-md-6 mb-3">
                  <label for="release_year">Ano</label>
                  <input
                    type="date"
                    class="form-control"
                    id="release_year"
                    placeholder="Ano"
                    v-model="release_year"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="genres">Titulo</label>
                  <input
                    type="text"
                    class="form-control"
                    id="titulo"
                    placeholder="Titulo"
                    v-model="title"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="description">Descrição</label>
                <textarea
                  class="form-control"
                  id="description"
                  rows="6"
                  v-model="description"
                ></textarea>
              </div>

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
              <button type="button" class="btn btn-light"  @click="back">Cancelar</button>
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
      title: "",
      release_year: "",

      season_number: "",
      novel: "",

      description: "",
      btnloading: false,
      loading: false,
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0]; // Get the selected file
      this.image_url = file; // Set the file object to the image_url property
    },
    back(){
        this.$router.go(-1)
    },
    async onCreateContent() {
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

      const requiredFields = ["season_number"];
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
        const novel = this.$route.params.id;
        const formData = new FormData();
        formData.append("novel", novel);
        formData.append("season_number", this.season_number);
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("release_year", this.release_year);

        this.btnloading = true;
        const response = await axios.post("api/season/create", formData, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });
        console.log(response);

        Toast.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Temporada criada com sucesso",
          timer: 3000,
        });

        this.btnloading = false;
        this.$router.push("/viewcontent");
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
