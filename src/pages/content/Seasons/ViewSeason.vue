<template>
  <div>
    <div class="mb-2"><h2 class="">Temporadas</h2></div>
    <div class="col-lg-12 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
          <div class="row mb-3">
            
            <div class="col-md-6 mb-3">
                <router-link
                      :to="`/addseason/${id}`"
                      type="button"
                      class="btn btn-inverse-info btn-sm mr-2"
                    >
                      <i class="mdi mdi-plus"></i>
                    </router-link>
              <!-- <button
                type="submit"
                class="btn btn-gradient-primary mr-2"
                @click=""
              >
                <i class="mdi mdi-account-search-outline menu-icon"></i>
              </button> -->
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Título</th>
                 
                  <th>Temporadas</th>
                  <th>Ano</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="season in contents" :key="season._id">
                  <td>{{ season.title }}</td>
                  <td>{{ season.season_number }}</td>
                  <td>{{ formatDate(season.release_year)}}</td>
                  <td>
                   
                    <router-link
                      :to="`/editseason/${season._id}`"
                      type="button"
                      class="btn btn-inverse-success btn-sm"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </router-link>
                    <button
                      type="button"
                      class="btn btn-inverse-danger btn-sm ml-2"
                      @click="deleteContent(season._id, season.season_number)"
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
      id : this.$route.params.id,
      editedContent: {}, // Inicializado como objeto vazio
      isModalActive: false, // Inicializado como falso (modal não visível)
      currentPage: 1,
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
        title: "Deseja excluir a temporada",
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
          const response = await axios.delete(`api/season/delete/${id}`, {
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
        const queryParams = {
          page: this.currentPage,
          pageSize: this.pageSize,
          searchTerm: this.searchTerm,
        };
        const id = this.$route.params.id;
        const response = await axios.get(`/api/season/getbynovelid/${id}`, {
          headers: { token: token },
          params: queryParams,
        });

        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);

        if (
          response.status === 200 &&
          response.data.success &&
          response.data.season.length > 0
        ) {
          this.contents = response.data.season; // Atribui o array de temporadas
          this.count = response.data.season.length; // Define o número de itens
          // Defina outras variáveis conforme necessário
        } else {
          this.contents = [];
          this.count = 0;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
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
</style>
