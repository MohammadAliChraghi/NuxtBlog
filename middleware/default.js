import axios from "axios";
export default async ({ req, app, store, redirect, route, error }) => {
  let token = app.$cookiz.get("token");
  axios.defaults.headers.common["authorization"] = token;
  if (token !== undefined) {
    store.commit("UPDATE_isLogged", true);
  }
  if (!store.state.isLogged) {
    store.commit("UPDATE_user", "");
    return redirect("/login");
  } else {
    await axios
      .get("http://localhost:3000/api/auth", {
        headers: { authorization: token },
      })
      .then(async (r) => {
        store.commit("UPDATE_user", r.data.user);
        if (route.path.startsWith("/dashboard")) {
          if (r.data.user.role !== "admin") {
            return redirect("/");
          }
        }
        await axios
          .post("http://localhost:3000/api/statics/visits", {
            headers: { authorization: token },
          })
          .catch((e) => {
            console.error(e);
          });
        if (route.path === "/login") {
          store.commit("UPDATE_notify", {
            type: "info",
            text: "You Are Logged In!",
          });
          return redirect("/");
        }
      })
      .catch((e) => {
        if (e.response.status === 503) {
          store.commit("UPDATE_notify", {
            type: "error",
            text: "Please Visit The Site Later!",
          });
        } else if (e.response.status === 401) {
          store.commit("UPDATE_user", "");
          app.$cookiz.remove("token");
          store.commit("UPDATE_notify", {
            type: "error",
            text: "authorization Failed! Please Login Again",
          });
          return redirect("/login");
        }
        console.warn(e);
      });
  }
};
