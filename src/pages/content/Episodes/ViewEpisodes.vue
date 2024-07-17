<template>
  <div>
    <div class="col-lg-12 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Episodios</h4>
          <div class="row mb-3">
            <div class="col-md-6 mb-3">
              <input
                type="text"
                class="form-control"
                id="searchTerm"
                v-model="searchTerm"
                placeholder="Pesquisar..."
              />
            </div>
            <div class="col-md-4 mb-3">
              <button
                type="submit"
                class="btn btn-gradient-primary mr-2"
                @click="fetchData"
              >
                <i class="mdi mdi-account-search-outline menu-icon"></i>
              </button>
            </div>
            <div class="col-md-2 mb-3">
              <button
                type="submit"
                class="btn btn-gradient-primary mr-2"
                data-toggle="modal"
                data-target="#exampleModalCenter11"
              >
                <i class="mdi mdi-plus menu-icon"></i>
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Temporada</th>
                  <th>Episódio</th>
                  <th>Ano</th>
                  <th>Vídeo</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="content in contents" :key="content._id">
                  <td>{{ content.title }}</td>
                  <td>
                    {{ content.season.season_number }} -
                    {{ content.season.title }}
                  </td>
                  <td>{{ content.episode_number }}</td>
                  <td>{{ formatDate(content.release_year) }}</td>
                  <td>
                    <a
                      href="#"
                      @click="setVideoUrl(content.video_url)"
                      data-toggle="modal"
                      data-target="#exampleModalCenter1"
                    >
                      Assistir
                    </a>
                  </td>

                  <td>
                    <router-link
                      :to="`/editepisode/${content._id}`"
                      type="button"
                      class="btn btn-inverse-success btn-icon"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </router-link>
                    <button
                      type="button"
                      class="btn btn-inverse-danger btn-icon ml-2"
                      @click="deleteContent(content._id, content.title)"
                    >
                      <i class="mdi mdi-delete"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="pagination-wrap mt-30">
                <nav>
                  <ul class="pagination justify-content-center">
                    <li
                      class="page-item"
                      :class="{ disabled: !hasPreviousPage }"
                    >
                      <a class="page-link" @click="previousPage">Anterior</a>
                    </li>
                    <li
                      class="page-item"
                      v-for="page in totalPages"
                      :key="page"
                      :class="{ active: isActivePage(page) }"
                    >
                      <a class="page-link" @click="goToPage(page)">{{
                        page
                      }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: !hasNextPage }">
                      <a class="page-link" @click="nextPage">Seguinte</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <!-- eslint-disable-next-line -->
    <div
      class="modal fade"
      id="exampleModalCenter1"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
      data-keyboard="false"
      data-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div class="video-container">
              <iframe
                :src="currentVideoUrl"
                title="Video Player"
                allow="autoplay; encrypted-media"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="hideModal"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal add episodio -->

    <div
      class="modal fade"
      id="exampleModalCenter11"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
      data-keyboard="false"
      data-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
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
                <label for="release_year">Ano de lancamento</label>
                <input
                  type="date"
                  class="form-control"
                  id="release_year"
                  placeholder="Ano"
                  v-model="release_year"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="genres">Numero</label>
                <input
                  type="number"
                  class="form-control"
                  id="genres"
                  placeholder="numero"
                  v-model="episode_number"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">Url do video</label>
              <textarea
                class="form-control"
                id="description"
                rows="6"
                v-model="video_url"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="submit"
              class="btn btn-gradient-primary mr-2"
              @click="onCreateContent()"
              :disabled="btnloading"
            >
              Salvar
            </button>
            <!--  -->
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { utils, writeFile } from "xlsx";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Cookies from "js-cookie";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";

export default {
  data() {
    return {
      contents: [],
      season: "",
      title: "",
      episode_number: "",
      video_url: "",
      release_year: "",
      btnloading: false,

      editedContent: {}, // Inicializado como objeto vazio
      isModalActive: false, // Inicializado como falso (modal não visível)
      currentPage: 1,
      currentVideoUrl: "",
      totalPages: 1,
      itemsPerPage: 10,
      loading: false,
      pageSize: 10,
      count: 0,
      firstEntryIndex: 0,
      lastEntryIndex: 0,
      searchTerm: "",
      selectedDate: null,
    };
  },
  computed: {
    hasPreviousPage() {
      return this.currentPage > 1;
    },
    hasNextPage() {
      return this.currentPage < this.totalPages;
    },
  },
  watch: {
    currentPage: "fetchData",
    pageSize: "fetchData",
    searchTerm: "fetchData",
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    hideModal() {
      this.currentVideoUrl = "";
    },
    setVideoUrl(videoUrl) {
      this.currentVideoUrl = videoUrl;
    },
    resetVideoUrl() {
      this.currentVideoUrl = "";
    },
    async deleteContent(id, name) {
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

      // Show confirmation dialog
      const confirmResult = await Swal.fire({
        title: "Deseja excluir o episodio ?",
        text: `${name} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, exclua-o!",
      });

      // Check if user clicked 'Yes'
      if (confirmResult.isConfirmed) {
        this.loading = true;
        try {
          const token = Cookies.get("token"); // Assuming you are using cookies to store the token
          const response = await axios.delete(`api/episode/delete/${id}`, {
            headers: {
              token: token,
            },
          });

          // Assuming the response contains some data, you can check it here
          console.log(response.data); // Use the response here

          Toast.fire({
            icon: "success",
            title: "Conteudo excluído com sucesso!",
          });
          this.loading = false;
          this.fetchData();
        } catch (error) {
          console.error("Erro ao excluir Conteudo:", error);

          Toast.fire({
            icon: "error",
            title: "Erro ao excluir Conteudo ",
          });
        }
      } else {
        Toast.fire({
          icon: "info",
          title: "Exclusão cancelada",
        });
      }
    },
    refresh() {
      (this.startDate = null),
        (this.endDate = null),
        (this.searchTerm = null),
        this.fetchData();
    },
    applyFilterDate() {
      // Check if both start and end dates are selected
      if (this.startDate && this.endDate) {
        // Convert the selected dates to ISO format
        const isoStartDate = new Date(this.startDate).toISOString();
        const isoEndDate = new Date(this.endDate).toISOString();

        // Process the selected date range (e.g., make an API request)
        console.log("Selected Date Range:");
        console.log("Start Date:", isoStartDate);
        console.log("End Date:", isoEndDate);

        // Reset currentPage to 1 when applying a new filter
        this.currentPage = 1;

        this.fetchData();
      } else {
        // Handle the case where one or both dates are not selected
        // console.log("Please select both start and end dates.");
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          toast: true,
          text: "Selecione as datas de início e término.",
          timer: 3000,
          showConfirmButton: false,
          position: "top-end",
        });
      }
    },
    shortenFileName(fileName, maxLength = 20) {
      if (fileName.length > maxLength) {
        return fileName.slice(0, maxLength) + "...";
      } else {
        return fileName;
      }
    },
    getFilePath(file) {
      return `${axios.defaults.baseURL}/${file}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}`;
    },
    isActivePage(page) {
      return page === this.currentPage;
    },
    async fetchData() {
      try {
        this.loading = true;

        const token = Cookies.get("token");
        const id = this.$route.params.id;

        const queryParams = {
          page: this.currentPage,
          pageSize: this.pageSize,
          searchTerm: this.searchTerm,
        };

        // Faz a requisição para buscar os episódios da temporada específica
        const response = await axios.get(`/api/episodes/season/${id}`, {
          headers: {
            token: token,
          },
          params: queryParams,
        });

        // Atualiza os dados da interface com os episódios retornados
        this.contents = response.data.episodes;
        this.count = this.contents.length; // Assumindo que a API retorna o número total de episódios
        this.totalPages = Math.ceil(this.count / this.pageSize);
        this.firstEntryIndex = (this.currentPage - 1) * this.pageSize + 1;
        this.lastEntryIndex = Math.min(
          this.currentPage * this.pageSize,
          this.count
        );
      } catch (error) {
        console.error("Erro ao buscar episódios:", error);
      } finally {
        this.loading = false;
      }
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
        "episode_number",
        "video_url",
      ];

      const token = Cookies.get("token");

      for (const field of requiredFields) {
        if (!this[field]) {
          Swal.fire({
            icon: "warning",
            title: "Aviso!",
            text: `O campo ${field} não pode estar vazio`,
            timer: 3000,
            showConfirmButton: false,
            position: "top-end",
          });
          return;
        }
      }

      try {
        const season = this.$route.params.id;
        const formData = new FormData();

        formData.append("title", this.title);
        formData.append("release_year", this.release_year);
        formData.append("season", season);
        formData.append("episode_number", this.episode_number);
        formData.append("video_url", this.video_url);

        // Logging FormData values for debugging
        // for (let [key, value] of formData.entries()) {
        //   console.log(key, value);
        // }

        this.btnloading = true;
        await axios.post("/api/episode/create", formData, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });

        Toast.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Episódio criado com sucesso",
        });

        this.btnloading = false;
        this.$router.go();

        this.closeModal();
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
    applyFilter() {
      this.currentPage = 1;
      this.fetchData();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchData();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchData();
      }
    },
    goToPage(page) {
      if (page !== this.currentPage) {
        this.currentPage = page;
        this.fetchData();
      }
    },
    async changePageSize() {
      this.currentPage = 1;
      this.itemsPerPage = this.pageSize;
      await this.fetchData();
    },

    exportToExcel() {
      const table = document.querySelector("table");
      const workbook = utils.table_to_book(table);
      writeFile(workbook, "despesas_lista.xlsx");
    },
    exportToPDF() {
      const table = document.querySelector("table");
      setTimeout(() => {
        const element = document.createElement("div");
        element.appendChild(table);
        html2pdf()
          .set({ filename: "transactions_list.pdf" })
          .from(element)
          .save();
      }, 500);
    },
  },
  created() {
    this.axios = axios; // Create a reference to axios
    this.fetchData();
  },
};
</script>
<style scoped>
.table tbody img {
  max-width: 100px;
  height: auto;
}
.table tbody ul {
  padding-left: 0;
  list-style-type: none;
}
.pagination-wrap nav ul {
  display: flex;
  list-style-type: none;
}
.pagination-wrap nav ul li {
  margin: 0 5px;
}
.pagination-wrap nav ul li a {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.pagination-wrap nav ul li a.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.pagination-wrap nav ul li a.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
.season-list {
  list-style-type: none;
  padding: 0;
}

.season-button {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  text-decoration: none;
  color: #333;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.season-button:hover {
  background-color: #e0e0e0;
}
.table-responsive {
  overflow-x: auto;
}

.table img {
  max-width: 100%;
  height: auto;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
}

.page-link {
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* Proporção 16:9 */
  height: 0;
  overflow: hidden;
  width: 100%;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Estilo personalizado para a modal */
.modal-content1 {
  background-color: rgba(0, 0, 0, 0.8); /* Fundo preto transparente */
  border: none;
}

.modal-header,
.modal-footer {
  border: none;
}

.modal-header .close {
  color: white;
}

.modal-title {
  color: white;
}

.img-resize {
  width: 0%; /* Largura desejada */
  height: 380px; /* Altura ajustável para manter a proporção */
  object-fit: cover;
}
</style>
