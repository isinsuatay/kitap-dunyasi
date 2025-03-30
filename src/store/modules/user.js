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
    updateUser(state, userData) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
  
      let users = JSON.parse(localStorage.getItem("users")) || []; 
  
      users = users.map((user) => 
        user.email === userData.email ? { ...user, ...userData } : user
      );
  
      localStorage.setItem("users", JSON.stringify(users));
    },
  },
  actions: {
    login({ commit }, { email, password }) {
      const user = getUserByEmail(email); 
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

    updateUser({ commit }, updatedUser) {  
      commit("updateUser", updatedUser);
    },
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
  },
};

