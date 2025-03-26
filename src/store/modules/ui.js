export default {
    namespaced: true,
    state: () => ({
      theme: localStorage.getItem('theme') || 'light'
    }),
    mutations: {
      setTheme(state, theme) {
        state.theme = theme;
        localStorage.setItem('theme', theme);
      }
    }
  };