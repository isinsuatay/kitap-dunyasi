import bcrypt from "bcryptjs";
import { addUser, getUsers, getUserByEmail } from "@/utils/localStorage";

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },

    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },

    CLEAR_USER(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },

  actions: {
    login({ commit }, { email, password }) {
      const user = getUserByEmail(email);
      if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
        throw new Error("Geçersiz e-posta veya şifre!");
      }

      const { password: _, ...userWithoutPassword } = user;
      commit("SET_USER", userWithoutPassword);
      commit("SET_TOKEN", `fake-jwt-token-${Date.now()}`);
    },

    logout({ commit }) {
      commit("CLEAR_USER");
    },

    async register({ commit }, { firstName, lastName, email, password }) {
      let users = getUsers();
      if (!Array.isArray(users)) users = [];

      if (users.some((user) => user.email === email)) {
        throw new Error("Bu e-posta adresi zaten kullanımda!");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const username = `${firstName} ${lastName}`;

      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
      };

      addUser(newUser);
      const createdUser = getUsers().find((u) => u.email === email);

      if (!createdUser) {
        throw new Error("Kayıt sırasında beklenmeyen bir hata oluştu!");
      }

      const { password: _, ...userWithoutPassword } = createdUser;
      commit("SET_USER", userWithoutPassword);
      commit("SET_TOKEN", `fake-jwt-token-${Date.now()}`);
    },

    async updateUser({ commit, state }, updatedFields) {
      const updatedUser = {
        ...state.user,
        ...updatedFields,
        username: `${updatedFields.firstName || state.user.firstName} ${updatedFields.lastName || state.user.lastName}`,
      };

      // users listesini güncelle
      let users = getUsers();
      users = users.map((user) => {
        if (user.email === state.user.email) {
          return { ...user, ...updatedUser };
        }
        return user;
      });

      localStorage.setItem("users", JSON.stringify(users));
      commit("SET_USER", updatedUser);
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    user: (state) => {
      if (!state.user) return null;
      return {
        ...state.user,
        username: state.user.username || `${state.user.firstName} ${state.user.lastName}`,
      };
    },
  },
};