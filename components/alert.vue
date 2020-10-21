<template>
  <div>
    <v-col cols="12" lg="4" md="8" class="pa-5">
    <v-alert v-if="type && text" dismissible elevation="1" :type="type">{{
      text
    }}</v-alert>
    </v-col>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      default: "info",
    },
    text: {
      default: "",
    },
  },
};
</script>
