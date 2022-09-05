import { createStore } from "vuex";
import axiosClient from "../axios";
import axios from "axios";

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("TOKEN"),
      //token: 123,
    },
    forms: {
      loading: false,
      links: [],
      data: [],
    },
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    currentForm: {
      loading: false,
      data: {},
    },
    notification: {
      show: false,
      type: null,
      message: null,
    },
    dashboard: {
      loading: false,
      data: {},
    },
    randomPhoto: {
      url: null,
      search: null,
    },
  },
  getters: {},
  actions: {
    register({ commit }, user) {
      return axiosClient.post("/register", user).then(({ data }) => {
        commit("setUser", data);
        return data;
      });
    },

    login({ commit }, user) {
      return axiosClient.post("/login", user).then(({ data }) => {
        console.log("SADAAAAA:" + data.token + "    " + data.email);
        console.log({ data });
        commit("setUser", data);
        return data;
      });
    },

    logout({ commit }) {
      return axiosClient.post("/logout").then((response) => {
        commit("logout");
        return response;
      });
    },

    //form = model.value iz FormView
    saveForm({ commit }, form) {
      delete form.image_url;
      let response;
      //ukoliko foma ima id, onda je azuriramo
      if (form.id) {
        response = axiosClient
          .put(`/form/${form.id}`, form)
          .then((res) => {
            commit("setCurrentForm", res.data);
            return res;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      } else {
        response = axiosClient.post("/form", form).then((res) => {
          commit("setCurrentForm", res.data);
          return res;
        });
      }
    },

    getForm({ commit }, id) {
      commit("setCurrentFormLoading", true);
      return axiosClient
        .get(`/form/${id}`)
        .then((res) => {
          commit("setCurrentForm", res.data);
          commit("setCurrentFormLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentFormLoading", true);
          throw err;
        });
    },

    deleteForm({}, id) {
      return axiosClient.delete(`/form/${id}`);
    },

    getForms({ commit }, payload, { url = null } = {}) {
      console.log("SEARCH in STORE");
      console.log(payload);
      url = url || `/form`;
      commit("setFormsLoading", true);
      return axiosClient
        .get(url, { params: { search: payload } })
        .then((res) => {
          console.log(axiosClient.get(url, payload));
          commit("setFormsLoading", false);
          commit("setForms", res.data);
          console.log(res.data);
          return res;
        });
    },

    getFormBySlug({ commit }, slug) {
      commit("setCurrentFormLoading", true);
      return axiosClient
        .get(`/form-by-slug/${slug}`)
        .then((res) => {
          commit("setCurrentForm", res.data);
          commit("setCurrentFormLoading", false);
        })
        .catch((err) => {
          commit("setCurrentFormLoading", false);
          throw err;
        });
    },

    saveFormAnswers({ commit }, { formId, answers }) {
      return axiosClient.post(`/form/${formId}/answer`, { answers });
    },

    getDashboardData({ commit }) {
      commit("dashboardLoading", true);
      return axiosClient
        .get(`/dashboard`)
        .then((res) => {
          commit("dashboardLoading", false);
          commit("setDashboardData", res.data);
          return res;
        })
        .catch((err) => {
          commit("dashboardLoading", false);
          return err;
        });
    },
    getPhotoFromDomain({ commit }, search_word) {
      commit("setRandomPhotoSearch", search_word);
      const options = {
        method: "GET",
        url: "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI",
        params: {
          q: `${search_word}`,
          pageNumber: "1",
          pageSize: "1",
          autoCorrect: "true",
        },
        headers: {
          "X-RapidAPI-Key":
            "c90973ff83msh0d133285d4c3801p1341c1jsn1abc474c4fda",
          "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
        },
      };

      return axios
        .request(options)
        .then((response) => {
          console.log("STORE");
          console.log(response.data.value[0]);
          commit("setRandomPhotoURL", response.data.value[0].url);
          return response;
          //return response.data.value[0].url;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  mutations: {
    //resetujemo podatke o korisniku i njegov token
    logout: (state) => {
      state.user.data = {};
      state.user.token = null;
      sessionStorage.removeItem("TOKEN");
    },
    setUser: (state, userData) => {
      state.user.token = userData.token;
      state.user.data = userData.user;
      sessionStorage.setItem("TOKEN", userData.token);
    },
    /*
    //azuriranje state.forms
    updateForm: (state, form) => {
      state.forms = state.forms.map((f) => {
        if (f.id == form.data.id) {
          return form.data;
        }
        return f;
      });
    },
    //cuvanje nove forme, dodavanje forme na kraj niza
    saveForm: (state, form) => {
      state.forms = [...state.forms, form.data];
    },
    */
    setCurrentFormLoading: (state, loading) => {
      state.currentForm.loading = loading;
    },

    setCurrentForm: (state, form) => {
      state.currentForm.data = form.data;
    },

    setFormsLoading: (state, loading) => {
      state.forms.loading = loading;
    },

    setForms: (state, forms) => {
      state.forms.links = forms.meta.links;
      state.forms.data = forms.data;
    },

    notify: (state, { message, type }) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 3000);
    },

    dashboardLoading: (state, loading) => {
      state.dashboard.loading = loading;
    },

    setDashboardData: (state, dashData) => {
      state.dashboard.data = dashData;
    },

    setRandomPhotoSearch: (state, search_word) => {
      state.randomPhoto.search = search_word;
    },

    setRandomPhotoURL: (state, url) => {
      state.randomPhoto.url = url;
    },
  },
  modules: {},
});

export default store;
