<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="8">
        <v-card elevation="4" class="pa-10 text-center">
          <h1 v-if="error.statusCode === 404">Page not found</h1>
          <h1 v-else>An error occurred</h1>
          <br />
          <hr />
          <h1>{{error.message}}</h1>
          <br />
          <hr />
          <br />
          <v-card-actions
            ><NuxtLink to="/" class="text-center"
              >Home page</NuxtLink
            ></v-card-actions
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ["error"],
};
</script>
