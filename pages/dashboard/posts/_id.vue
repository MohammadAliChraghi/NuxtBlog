<template>
  <div class="pr-4">
    <v-text-field outlined v-model="post.title" label="Title" />
    <v-file-input
      :label="post.thumbnail"
      v-model="post.thumbnail"
      truncate-length="50"
      prepend-icon="mdi-camera"
    />
    <v-textarea
      rows="23"
      outlined
      label="Text"
      v-model="post.text"
    ></v-textarea>
    <v-btn @click="Update()" color="success">Update</v-btn>
    <v-btn @click="cancel()" color="error">Cancel</v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  layout: "dashboard",
  data() {
    return {
      post: { id: 0, title: "", text: "", thumbnail: "" },
    };
  },
  head() {
    return {
      title: `Edit ${this.post.title}`,
    };
  },
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id);
  },
  methods: {
    async Update() {
      const formData = new FormData();
      formData.append("image", this.post.thumbnail);
      formData.set("post", JSON.stringify(this.post));
      await axios({
        method: "post",
        url: `http://localhost:3000/api/posts/update/${this.post.id}`,
        headers: {
          "Content-type": "multipart/form-data",
          authorization: this.$cookiz.get("token"),
        },
        data: formData,
      })
        .then(async (r) => {
          alert("Post Succefuly Updated!");
          await axios
            .get(`http://localhost:3000/api/posts/${this.$route.params.id}`, {
              headers: { authorization: this.$cookiz.get("token") },
            })
            .then((r) => {
              this.post = r.data[0];
            })
            .catch((e) => {
              console.error("Post NoT Found!");
              this.$router.go("/dashboard/posts");
            });
        })
        .catch((e) => console.error(e));
    },
    cancel() {
      this.$router.go("/dashboard/posts");
    },
  },
  async fetch() {
    await axios
      .get(`http://localhost:3000/api/posts/${this.$route.params.id}`, {
        headers: { authorization: this.$cookiz.get("token") },
      })
      .then((r) => {
        this.post = r.data[0];
      })
      .catch((e) => {
        console.error("Post NoT Found!");
        this.$router.go("/dashboard/posts");
      });
  },
  fetchOnServer: false,
};
</script>
