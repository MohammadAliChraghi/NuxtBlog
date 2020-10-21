export default {
  state() {
    return {
      isLogged: false,
      user: null,
      notify: { type: "", text: "" },
    };
  },
  mutations: {
    UPDATE_isLogged(state, tf) {
      state.isLogged = tf;
    },
    UPDATE_user(state, u) {
      state.user = u;
    },
    UPDATE_notify(state, { type, text }) {
      state.notify.type = type;
      state.notify.text = text;
    },
  },
  getters: {
    GET_isLogged(state) {
      return state.isLogged;
    },
    GET_user(state) {
      return state.user;
    },
    GET_notify_text(state) {
      return state.notify.text;
    },
    GET_notify_type(state) {
      return state.notify.type;
    },
  },
};
