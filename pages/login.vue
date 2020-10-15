<template>
  <v-form ref="login" v-model="valid">
    <v-container class="d-flex flex-column justify-center">
      <v-row align="center" justify="center">
        <v-col cols="12" md="4">
          <v-alert v-if="error.length" type="error">{{ error }}</v-alert>
          <v-alert v-if="success" type="success">Successfuly LoggedIn</v-alert>
          <v-col cols="12">
            <v-text-field
              v-model="username"
              :rules="nameRules"
              :counter="128"
              label="First name"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="password"
              :rules="passRules"
              :counter="128"
              label="Last name"
              required
            ></v-text-field>
          </v-col>
          <v-btn @click="submit">SUBMIT</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  },
  data() {
    return {
      valid: false,
      error: "",
      success: false,
      username: "",
      nameRules: [
        v => !!v || "Required",
        v => (v && v.length >= 3) || "Min 3 characters"
      ],
      password: "",
      passRules: [
        v => !!v || "Required",
        v => (v && v.length >= 6) || "Min 6 characters"
      ]
    };
  },
  methods: {
    async submit() {
      if (this.$refs.login.validate()) {
        const res = await this.$axios({
          method: "post",
          url: `/api/login`,
          data: {
            username: this.username,
            password: this.password
          }
        })
          .then(r => {
            this.success = true;
            this.error = "";
            setTimeout(() => {
              this.$router.push("/");
            }, 1500);
          })
          .catch(e => {
            if (e.response.status === 401) {
              this.error = e.response.data;
            } else if (e.response.status === 404) {
              this.error = "Connection Error!";
            }
          });
      }
    }
  }
};
</script>

<style>
.v-progress-linear {
  position: fixed;
  top: 0;
}
</style>
