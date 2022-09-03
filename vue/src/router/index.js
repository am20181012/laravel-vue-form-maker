import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../components/DefaultLayout.vue";
import Login from "../view/Login.vue";
import Register from "../view/Register.vue";
import Dashboard from "../view/Dashboard.vue";
import Forms from "../view/Forms.vue";
import store from "../store";
import AuthLayout from "../components/AuthLayout.vue";
import FormView from "../view/FormView.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    name: "Dashboard",
    component: DefaultLayout,

    //pokazuje router-u da ova putanja (/ ili /dashboard) zahteva autentifikaciju
    meta: { requiresAuth: true },

    //sta god da se nadje ovde imace header Dashboard-a, a sam sadrzaj ce biti kastomizovan...
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "/forms",
        name: "Forms",
        component: Forms,
      },
      {
        path: "/forms/create",
        name: "FormCreate",
        component: FormView,
      },
      {
        path: "/forms/:id",
        name: "FormView",
        component: FormView,
      },
    ],
  },
  {
    path: "/auth",
    redirect: "/login",
    name: "Auth",
    component: AuthLayout,
    meta: { isGuest: true },
    children: [
      { path: "/login", name: "Login", component: Login },
      { path: "/register", name: "Register", component: Register },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//sa (from) koje rute korisnik pokusava da se redirektuje na (to) koju rutu
//callback (next)
router.beforeEach((to, from, next) => {
  //ukoliko pokusavamo da pristupimo nekoj stranici bez tokena salje nas na Login stranicu
  if (to.meta.requiresAuth && !store.state.user.token) {
    next({ name: "Login" });

    //drugi slucaj je kada je korisnik prijavljen
    //i pokusava da pristupi Login strani, moramo ga redirektovato na Dashboard
  } else if (
    store.state.user.token &&
    to.meta.isGuest //(to.name === "Login" || to.name === "Register")
  ) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
