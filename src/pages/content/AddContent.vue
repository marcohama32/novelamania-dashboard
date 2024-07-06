<template>
  <div>
    <div class="row">
      <div class="col-md-6 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Adicionar Novela ou Dorama</h4>
            <form
              class="forms-sample mt-4"
              @submit.prevent="onCreateContent"
              enctype="multipart/form-data"
            >
              <div class="form-group">
                <label for="title">Título</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  placeholder="Título"
                  v-model="title"
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
                  <label for="genres">Gênero</label>
                  <input
                    type="text"
                    class="form-control"
                    id="genres"
                    placeholder="Gênero"
                    v-model="genres"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="type">Tipo</label>
                <select v-model="type" class="form-control" id="type">
                  <option value="novela">Novela</option>
                  <option value="dorama">Dorama</option>
                </select>
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
              <div class="form-group">
                <label>Upload de Arquivo</label>
                <input
                  class="form-control file-upload-info"
                  type="file"
                  id="fileInput"
                  ref="fileInput"
                  accept=".jpg, .jpeg, .png, .pdf"
                  @change="onFileChange"
                  placeholder="Upload Image"
                />
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
              </div>
              <!-- <button type="submit" class="btn btn-gradient-primary mr-2">
                Salvar
              </button> -->
              <button class="btn btn-light">Cancelar</button>
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
      genres: "",
      image_url: null,
      type: "",
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

      const requiredFields = [
        "title",
        "release_year",
        "genres",
        "image_url",
        "type",
        "description",
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
        formData.append("title", this.title);
        formData.append("release_year", this.release_year);
        formData.append("genres", this.genres);
        formData.append("image_url", this.image_url);
        formData.append("type", this.type);
        formData.append("description", this.description);

        this.btnloading = true;
        const response = await axios.post("api/novel/create", formData, {
          headers: {
            token: token,
          },
        });
        console.log(response);

        Toast.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Conteúdo criado com sucesso",
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
