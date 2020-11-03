<template>
  <v-app>
    <v-toolbar dense style="flex: initial;">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer />
      <v-btn icon v-if="$store.getters.GET_isLogged" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-toolbar>
    <Nuxt />
    <Alert
      :type="$store.getters.GET_notify_type"
      :text="$store.getters.GET_notify_text"
    />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: "",
    };
  },
  methods: {
    logout() {
      this.$cookiz.remove("token");
      this.$router.go("/");
    },
  },
  mounted() {
    if (process.client) {
      this.title = document.title;
    }
  },
};
</script>
