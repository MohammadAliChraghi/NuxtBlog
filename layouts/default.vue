<template>
  <v-app>
    <Nuxt />
    <Alert
      :type="$store.getters.GET_notify_type"
      :text="$store.getters.GET_notify_text"
    />
  </v-app>
</template>

<script>
export default {};
</script>
