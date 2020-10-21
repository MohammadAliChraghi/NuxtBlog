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
          <v-btn @click="login()">SUBMIT</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
export default {
  data() {
    return {
      valid: false,
      error: "",
      success: false,
      username: "",
      nameRules: [
        (v) => !!v || "Required",
        (v) => (v && v.length >= 3) || "Min 3 characters",
      ],
      password: "",
      passRules: [
        (v) => !!v || "Required",
        (v) => (v && v.length >= 6) || "Min 6 characters",
      ],
    };
  },
  methods: {
    async login() {
      if (this.$refs.login.validate()) {
        const res = await this.$axios({
          method: "post",
          url: `/api/login`,
          data: {
            username: this.username,
            password: this.password,
          },
        })
          .then((r) => {
            this.$store.commit("UPDATE_isLogged", true);
            this.success = true;
            this.error = "";
            this.$cookiz.set("token", r.data, {
              maxAge: 60 * 60 * 24 * 360 * 2,
            });
            setTimeout(() => {
              this.$router.push("/");
            }, 1500);
          })
          .catch((e) => {
            this.error = e.response.data;
          });
      }
    },
  },
};
</script>
