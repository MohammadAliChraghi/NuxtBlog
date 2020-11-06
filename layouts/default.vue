<template>
  <v-app>
    <v-toolbar dense style="flex: initial;">
      <v-toolbar-title><nuxt-link to="/">Home</nuxt-link></v-toolbar-title>
      <v-spacer />
      <v-spacer />
      <nuxt-link
        v-if="$store.getters.GET_user.role === 'admin'"
        to="/dashboard"
      >
        <v-btn icon>
          <v-icon>mdi-home-analytics</v-icon>
        </v-btn>
      </nuxt-link>
      <v-btn
        icon
        v-if="$store.getters.GET_isLogged"
        @click="search.input = !search.input"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon v-if="$store.getters.GET_isLogged" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-toolbar>
    <v-sheet @click="outSearch" class="search-box-parent" v-if="search.input">
      <v-sheet rounded elevation="10" width="30vw" class="pa-2 search-box">
        <v-text-field
          placeholder="Serach In Posts..."
          v-if="search.input"
          dense
          v-model="search.keyword"
          autofocus
        />
        <v-card v-for="i in search.filtered" :key="i.id"
          ><v-card-title>{{ i.title }}</v-card-title>
          <img
            v-if="i.thumbnail.length"
            style="width: 100%;height: 100%"
            :src="`/${i.thumbnail}`"
        /></v-card>
      </v-sheet>
    </v-sheet>
    <Nuxt />
    <Alert
      :type="$store.getters.GET_notify_type"
      :text="$store.getters.GET_notify_text"
    />
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      search: {
        input: false,
        keyword: "",
        filtered: [],
      },
    };
  },
  methods: {
    outSearch() {
      this.search.input = false;
    },
    logout() {
      this.$cookiz.remove("token");
      this.$router.go("/");
    },
  },
  watch: {
    "search.keyword": async function(val, oldVal) {
      if (val !== "") {
        await axios
          .get(`http://localhost:3000/api/search/posts/${val}`, {
            headers: { authorization: this.$cookiz.get("token") },
          })
          .then((r) => {
            console.log(r);
            this.search.filtered = r.data;
          })
          .catch((e) => console.error(e));
      } else {
        this.search.filtered = [];
      }
    },
    $route(to, from) {},
  },
};
</script>

<style>
.search-box-parent {
  width: 100vw;
  position: absolute;
  z-index: 10;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5) !important;
}
.search-box {
  overflow-y: scroll;
  position: fixed;
  left: 34vw;
  top: 48px;
  height: 90vh;
}
</style>
