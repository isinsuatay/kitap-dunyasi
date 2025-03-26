// store/modules/currency.js
import { fetchExchangeRates, getStoredExchangeRates } from "@/services/exchangeService";

export default {
  namespaced: true,
  state: {
    exchangeRates: getStoredExchangeRates() || {},
    selectedCurrency: localStorage.getItem("selectedCurrency") || "USD",
    lastSync: localStorage.getItem("lastSync") || null,
    syncInProgress: false,
  },
  mutations: {
    setExchangeRates(state, rates) {
      state.exchangeRates = rates;
      state.lastSync = new Date().toISOString();
      localStorage.setItem("lastSync", state.lastSync);
    },
    setSelectedCurrency(state, currency) {
      state.selectedCurrency = currency;
      localStorage.setItem("selectedCurrency", currency);
    },
    setSyncInProgress(state, status) {
      state.syncInProgress = status;
    },
  },
  actions: {
    async fetchExchangeRates({ commit }) {
      try {
        const rates = await fetchExchangeRates(); // API'den döviz verisi al
        if (rates) commit("setExchangeRates", rates); // Veriyi store'a kaydet
      } catch (error) {
        console.error("Döviz kuru verileri alınırken hata oluştu:", error);
      }
    },
    startExchangeRatesSync({ dispatch, state, commit }) {
      if (state.syncInProgress) return;
      commit("setSyncInProgress", true);
      dispatch("fetchExchangeRates");
    
      state.syncInterval = setInterval(() => {
        if (!state.syncInProgress) return;
        dispatch("fetchExchangeRates");
      }, 30 * 60 * 1000);
    },
    
    stopExchangeRatesSync({ state, commit }) {
      commit("setSyncInProgress", false);
      clearInterval(state.syncInterval);
    },
    setSelectedCurrency({ commit }, currency) {
      commit("setSelectedCurrency", currency);
    },
  },
  getters: {
    exchangeRates: (state) => state.exchangeRates,
    selectedCurrency: (state) => state.selectedCurrency,
    convertPrice: (state) => (price, bookCurrency = "USD") => {
      const exchangeRates = state.exchangeRates;
      const selectedCurrency = state.selectedCurrency;
    
      if (!exchangeRates || !exchangeRates[selectedCurrency] || !exchangeRates[bookCurrency]) {
        console.warn("Döviz kuru bulunamadı, orijinal fiyat gösteriliyor.");
        return price.toFixed(2);
      }
    
      const baseRate = exchangeRates[bookCurrency];
      const targetRate = exchangeRates[selectedCurrency];
    
      if (!baseRate || !targetRate || baseRate === 0 || targetRate === 0) {
        console.error("Geçersiz döviz kuru: sıfır veya eksik değer");
        return "N/A";
      }
    
      return ((price / baseRate) * targetRate).toFixed(2);
    }
  },
};