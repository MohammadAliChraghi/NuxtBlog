<template>
  <div v-if="loading">
    <v-progress-linear indeterminate></v-progress-linear>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    };
  },
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style>
div .v-progress-linear {
  z-index: 10000000;
}
.v-progress-linear .v-progress-linear__indeterminate {
  background-color: #3191ff;
}
</style>
