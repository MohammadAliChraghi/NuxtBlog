<template>
  <div>
    <GoogleLogin :params="params" :onSuccess="onSuccess" :onFailure="onFailure"
      >Login</GoogleLogin
    >
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";
export default {
  data() {
    return {
      // client_id is the only required property but you can add several more params, full list down bellow on the Auth api section
      params: {
        client_id:
          "243826239589-gh5d3jd8s3sinun053o4m4g4db6g0bse.apps.googleusercontent.com",
      },
    };
  },
  components: {
    GoogleLogin,
  },
  methods: {
    onSuccess(googleUser) {
      // This only gets the user information: id, name, imageUrl and email
      console.log(googleUser.getBasicProfile());
    },
    onFailure() {
      console.log("fick");
    },
  },
};
</script>
