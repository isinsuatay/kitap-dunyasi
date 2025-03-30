import bcrypt from "bcryptjs";
import { addUser, getUsers, getUserByEmail } from "@/utils/localStorage";


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
    updateUser(state, updatedUser) {
      state.user = { ...state.user, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  actions: {
    login({ commit }, { email, password }) {
      const user = getUserByEmail(email); 
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error("Geçersiz e-posta veya şifre!");
        return;
      }

      const token = `fake-jwt-token-${Date.now()}`;
      commit("setUser", user);
      commit("setToken", token);
    },

    logout({ commit }) {
      commit("clearUser");
    },
    async register({ commit }, { firstName, lastName, email, password }) {
      let users = getUsers();
      if (!Array.isArray(users)) {
        users = []; 
      }
    
      if (users.some((user) => user.email === email)) {
        throw new Error("Bu e-posta adresi zaten kullanımda!");
      }
    
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { firstName, lastName, email, password: hashedPassword };
    
      addUser(newUser);
    
      // Güncellenmiş kullanıcı listesini al
      users = getUsers(); 
    
      const createdUser = users.find((u) => u.email === email);
      if (!createdUser) {
        throw new Error("Kayıt sırasında beklenmeyen bir hata oluştu!");
      }
    
      const { password: _, ...userWithoutPassword } = createdUser;
      commit("setUser", userWithoutPassword);
      commit("setToken", `fake-jwt-token-${Date.now()}`);
    },

    updateUser(state, updatedUser) {
      const updatedUserData = { ...state.user, ...updatedUser };
      state.user = updatedUserData;
      localStorage.setItem("user", JSON.stringify(updatedUserData)); 
    },
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
  },
};

