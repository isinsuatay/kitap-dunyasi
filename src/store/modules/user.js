// store/modules/user.js
import bcrypt from "bcryptjs";
import { addUser, getUsers } from "@/utils/localstorage";

export default {
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    updateUser(state, updatedUser) {
      state.user = { ...state.user, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  actions: {
    login({ commit }, { email, password }) {
      const users = getUsers();
      const user = users.find((u) => u.email === email);

      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error("Geçersiz e-posta veya şifre!");
      }

      const token = `fake-jwt-token-${Date.now()}`;
      commit("setUser", user);
      commit("setToken", token);
    },

    logout({ commit }) {
      commit("clearUser");
    },

    async register({ commit }, { firstName, lastName, email, password }) {
      const users = getUsers();

      if (users.some((user) => user.email === email)) {
        throw new Error("Bu e-posta adresi zaten kullanımda!");
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = { firstName, lastName, email, password: hashedPassword };

      addUser(newUser);

      const token = `fake-jwt-token-${Date.now()}`;
      commit("setUser", newUser);
      commit("setToken", token);
    },
    updateUser({ commit }, updatedUser) {
      commit("updateUser", updatedUser);
    },
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
  },
};