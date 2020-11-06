<template>
  <div class="pr-4">
    <v-text-field outlined v-model="post.title" label="Title" />
    <v-file-input
      v-model="post.thumbnail"
      truncate-length="50"
      prepend-icon="mdi-camera"
    />
    <v-textarea rows="23" outlined label="Text" v-model="post.text" />
    <v-btn @click="Add()" color="success">Add</v-btn>
    <v-btn @click="cancel()" color="error">Cancel</v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  layout: "dashboard",
  data() {
    return {
      post: {
        title: "",
        author: this.$store.getters.GET_user.id,
        text: "",
        thumbnail: "",
      },
    };
  },
  head() {
    return {
      title: "New Post",
    };
  },
  methods: {
    async Add() {
      const formData = new FormData();
      formData.append("image", this.post.thumbnail);
      formData.set("post", JSON.stringify(this.post));
      await axios({
        method: "post",
        url: "http://localhost:3000/api/posts/",
        headers: {
          "Content-type": "multipart/form-data",
          authorization: this.$cookiz.get("token"),
        },
        data: formData,
      })
        .then((r) => {
          alert("Succefuly Added!");
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>
