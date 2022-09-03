import { createStore } from "vuex";
import axiosClient from "../axios";

const tempForms = [
  {
    id: 1,
    title: "Zanimljiva geografija",
    slug: "zanimljiva-geografija",
    status: "draft",
    image: "https://www.mojedete.info/wp-content/uploads/2016/11/mapa-ruke.jpg",
    description:
      "Kratak test za prave ljubitelje geografije. Sastavljen je od nekoliko pitanja koja proveravaju znanje zaljubljenika u geografiju",
    created_at: "2022-09-02 20:00:00",
    updated_at: "2022-09-02 20:00:00",
    expire_date: "2022-09-22 20:00:00",
    questions: [
      {
        id: 1,
        type: "select",
        question: "Zemlja sa najvise stanovnika: ",
        description: "izabrati jednu od ponudjenih",
        data: {
          options: [
            { uuid: "f8af96f2-1d80-4632-9e9e-b560670e52ea", text: "SAD" },
            { uuid: "f8bf96f2-1d89-4632-9e9e-b560670e52ea", text: "Brazil" },
            { uuid: "f8jf96f2-1d80-4637-9e9e-b560670e52ea", text: "Kina" },
            { uuid: "f8hf96f2-1d80-4636-9e9e-b560670e52ea", text: "Indija" },
            { uuid: "f8uf96f2-1d80-4634-9e9e-b560670e52ea", text: "Argentina" },
          ],
        },
      },
      {
        id: 2,
        type: "checkbox",
        question: "Zemlja sa najvise stanovnika: ",
        description: "",
        data: {
          options: [
            { uuid: "f8af96f2-1d85-4632-9e9e-b560670e52ra", text: "SAD" },
            { uuid: "f8bf96f2-1d83-4632-9e9e-b560670e52ga", text: "Brazil" },
            { uuid: "f8jf96f2-1d80-4637-9e9e-b560670e52ha", text: "Kina" },
            { uuid: "f8hf96f2-1d84-4636-9e9e-b560670e52sa", text: "Indija" },
            { uuid: "f8uf96f2-1d89-4634-9e9e-b560670e52ma", text: "Argentina" },
          ],
        },
      },
      {
        id: 3,
        type: "radio",
        question: "Zemlja sa najvise stanovnika: ",
        description: "izabrati jednu od ponudjenih",
        data: {
          options: [
            { uuid: "f8af96f2-1d80-4632-9e9e-j560670e52ea", text: "SAD" },
            { uuid: "f8bf96f2-1d89-4692-9e9e-f590670e52ea", text: "Brazil" },
            { uuid: "f8jf96f2-1d80-4657-9e9e-s550670e52ea", text: "Kina" },
            { uuid: "f8hf96f2-1d80-4636-9e9e-k540670e52ea", text: "Indija" },
            { uuid: "f8uf96f2-1d80-4624-9e9e-f530670e52ea", text: "Argentina" },
          ],
        },
      },
      {
        id: 4,
        type: "checkbox",
        question: "Zemlja sa najvise stanovnika: ",
        description: "izabrati jednu od ponudjenih",
        data: {
          options: [
            { uuid: "f8af96f2-1d80-4632-9e9e-b560670e52ea", text: "SAD" },
            { uuid: "f8bf96f2-1d89-4632-9e9e-b560670e52ea", text: "Brazil" },
            { uuid: "f8jf96f2-1d80-4637-9e9e-b560670e52ea", text: "Kina" },
            { uuid: "f8hf96f2-1d80-4636-9e9e-b560670e52ea", text: "Indija" },
            { uuid: "f8uf96f2-1d80-4634-9e9e-b560670e52ea", text: "Argentina" },
          ],
        },
      },
      {
        id: 5,
        type: "text",
        question: "Zemlja sa najvise stanovnika: ",
        description: null,
        data: {},
      },
      {
        id: 6,
        type: "textarea",
        question: "Zemlja sa najvise stanovnika: ",
        description: null,
        data: {},
      },
    ],
  },
  {
    id: 2,
    title: "Rodjendanska anketa",
    slug: "rodjendanska-anketa",
    status: "active",
    image: "http://restorandren.com/wp-content/uploads/2017/01/rodjendan.jpg",
    description: "Kako biste voleli da se zabavimo",
    created_at: "2022-08-02 20:00:00",
    updated_at: "2022-08-02 20:00:00",
    expire_date: "2022-09-04 20:00:00",
    questions: [],
  },
  {
    id: 3,
    title: "Poliglota",
    slug: "poliglota",
    status: "active",
    image: "https://imenik.rs/sites/default/files/photos/1156-poliglota-04.jpg",
    description: "koliko jezika govoris???",
    created_at: "2022-08-02 20:00:00",
    updated_at: "2022-08-02 20:00:00",
    expire_date: "2022-09-04 20:00:00",
    questions: [],
  },
  {
    id: 4,
    title: "Kulturni vodic",
    slug: "kulturni-vodic",
    status: "active",
    image:
      "http://www.seecult.org/sites/default/files/kultura-identitet-sanu.jpg",
    description: "pokazi da mozes biti vodic kroz kulturu grada Beograda",
    created_at: "2022-08-02 20:00:00",
    updated_at: "2022-08-02 20:00:00",
    expire_date: "2022-09-04 20:00:00",
    questions: [],
  },
];

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("TOKEN"),
      //token: 123,
    },
    forms: [...tempForms],
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
  },
  getters: {},
  actions: {
    register({ commit }, user) {
      return axiosClient.post("/register", user).then(({ data }) => {
        commit("setUser", data);
        return data;
      });

      /*
      return fetch(`http://localhost:8000/api/register`, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        method: "POST",
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((res) => {
          commit("setUser", res);
          return res;
        });
        */
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
        response = axiosClient.put(`/form/${form.id}`, form).then((res) => {
          commit("updateForm", res.data);
          return res;
        });
      } else {
        response = axiosClient.post("/form", form).then((res) => {
          commit("saveForm", res.data);
          return res;
        });
      }
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
  },
  modules: {},
});

export default store;
