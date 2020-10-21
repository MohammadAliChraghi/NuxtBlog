<template>
  <v-row justify="center" align="center">
    <nuxt-link to="/login">Login</nuxt-link>
    {{$store.getters.GET_user}}
  </v-row>
</template>

<script>
export default {
};
</script>
