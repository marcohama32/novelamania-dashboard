<template>
  <div>
    <div class="mb-2"><h2 class="">Clientes</h2></div>
    <div class="col-lg-12 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
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
            <div class="col-md-6 mb-3">
              <button
                type="submit"
                class="btn btn-gradient-primary mr-2"
                @click="fetchData"
              >
                <i class="mdi mdi-account-search-outline menu-icon"></i>
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Contacto</th>
                  <th>Sexo</th>
                  <th>Data</th>
                  <th>Email</th>
                  <th>Provincia</th>
                  <th>Pacote</th>
                  <th>Dias Restantes</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="content in contents" :key="content._id">
                  <td>{{ content.firstName }} {{ content.lastName }}</td>
                  <td>{{ content.contact1 }}</td>
                  <td>{{ content.gender }}</td>
                  <td>{{ formatDate(content.dob) }}</td>
                  <td>{{ content.email }}</td>
                  <td>{{ content.province }}</td>
                  <td>
                    <!-- Verifica se há uma subscrição -->
                    <template v-if="content.subscription">
                      <!-- Exibe o nome do pacote se disponível, senão exibe 'N/A' -->
                      {{
                        content.subscription.package
                          ? content.subscription.package.name
                          : "N/A"
                      }}
                    </template>
                    <template v-else> N/A </template>
                  </td>
                  <td>
                    <!-- Verifica se há uma subscrição -->
                    <template v-if="content.subscription">
                      <!-- Exibe os dias restantes se disponível, senão exibe 'N/A' -->
                      {{
                        content.subscription.daysRemaining != null
                          ? content.subscription.daysRemaining
                          : "N/A"
                      }}
                    </template>
                    <template v-else> N/A </template>
                  </td>
                  <td>
                    <router-link
                      :to="`/editcliente/${content._id}`"
                      type="button"
                      class="btn btn-inverse-success btn-sm"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </router-link>
                    <router-link
                      :to="`/subscreverpacote/${content._id}`"
                      type="button"
                      class="btn btn-inverse-info ml-2 btn-sm"
                    >
                      <i class="mdi mdi-package-variant"></i>
                    </router-link>
                    <button
                      type="button"
                      class="btn btn-inverse-danger btn-sm ml-2"
                      @click="deleteContent(content._id, content.firstName)"
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
        title: "Deseja excluir Cliente ?",
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
          const response = await axios.delete(`api/user/delete/${id}`, {
            headers: {
              token: token,
            },
          });

          // Assuming the response contains some data, you can check it here
          console.log(response.data); // Use the response here

          Toast.fire({
            icon: "success",
            title: "Cliente excluído com sucesso!",
          });
          this.loading = false;
          this.fetchData();
        } catch (error) {
          console.error("Erro ao excluir Cliente:", error);

          Toast.fire({
            icon: "error",
            title: "Erro ao excluir Cliente ",
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
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0!
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
,
    isActivePage(page) {
      return page === this.currentPage;
    },
    async fetchData() {
      try {
        this.loading = true;

        const token = Cookies.get("token");
        if (!token) {
          throw new Error(
            "Token não encontrado. Por favor, faça login novamente."
          );
        }

        const queryParams = {
          page: this.currentPage,
          pageSize: this.pageSize,
          searchTerm: this.searchTerm,
        };

        const response = await axios.get("/api/user/getallcustomers", {
          headers: {
            token: token,
          },
          params: queryParams,
        });

        if (response && response.data.users) {
          this.contents = response.data.users;
          console.log("Usuários", this.users);

          // Verifica se há pacote associado e carrega seus detalhes
         

          this.count = response.data.count || 0;
          this.totalPages = response.data.pages || 0;
          this.firstEntryIndex = (this.currentPage - 1) * this.pageSize + 1;
          this.lastEntryIndex = Math.min(
            this.currentPage * this.pageSize,
            this.count
          );
        } else {
          throw new Error("Resposta da API inválida.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        console.error(
          "Erro ao buscar dados. Por favor, tente novamente mais tarde."
        );
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
