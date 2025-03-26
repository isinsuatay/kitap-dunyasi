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
      dispatch("fetchExchangeRates"); // Döviz verisini al
  
      setInterval(() => {
        if (!state.syncInProgress) return;
        dispatch("fetchExchangeRates"); // Döviz verisini periyodik olarak al
      }, 30 * 60 * 1000); // 30 dakika arayla
    },
    stopExchangeRatesSync({ commit }) {
      commit("setSyncInProgress", false);
    },
    startExchangeRatesSync({ dispatch, state, commit }) {
      if (state.syncInProgress) return;
      commit("setSyncInProgress", true);
      dispatch("fetchExchangeRates");

      setInterval(() => {
        if (!state.syncInProgress) return;
        dispatch("fetchExchangeRates");
      }, 30 * 60 * 1000);
    },
    stopExchangeRatesSync({ commit }) {
      commit("setSyncInProgress", false);
    },
    // setSelectedCurrency action'ını doğru bir şekilde ekledik
    setSelectedCurrency({ commit }, currency) {
      commit("setSelectedCurrency", currency);
    },
  },
  getters: {
    exchangeRates: (state) => state.exchangeRates,
    selectedCurrency: (state) => state.selectedCurrency,
    convertPrice: (state) => (price, bookCurrency = "USD") => {
      if (!state.exchangeRates || !state.exchangeRates[state.selectedCurrency]) {
        console.warn("Döviz kuru bulunamadı, orijinal fiyat gösteriliyor.");
        return price;
      }

      const baseRate = state.exchangeRates[bookCurrency] || 1;
      const targetRate = state.exchangeRates[state.selectedCurrency] || 1;

      if (baseRate === 0 || targetRate === 0) {
        console.error("Geçersiz döviz kuru: sıfır değeri");
        return "N/A";
      }

      return ((price / baseRate) * targetRate).toFixed(2);
    },
  },
};