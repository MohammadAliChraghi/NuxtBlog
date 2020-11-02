<template>
  <div class="pa-3">
    <h1>{{ post.title }}</h1>
    <br />
    <hr />
    <img
      v-if="post.thumbnail.length"
      style="width: 100%;height: 100%"
      :src="`/${post.thumbnail}`"
    />
    <br />
    <hr />
    <br />
    <h2>By {{ post.author }}</h2>
    <br />
    <hr />
    <br />
    <div style="text-align: justify">{{ post.text }}</div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      p_id: this.$route.params.id,
      post: { id: "", title: "", text: "", thumbnail: "" },
    };
  },
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id);
  },
  async fetch() {
    await axios
      .get(`http://localhost:3000/api/posts/${this.p_id}`, {
        headers: { authorization: this.$cookiz.get("token") },
      })
      .then(async (r) => {
        this.post = r.data[0];
        await axios({
          method: "get",
          url: `http://localhost:3000/api/users/${this.post.author}`,
          headers: { authorization: this.$cookiz.get("token") },
        })
          .then((r) => {
            this.post.author = r.data[0].username;
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((e) => console.error(e));
  },
  fetchOnServer: false,
};
</script>

<style>
.v-application {
  height: 100%;
  display: block;
}
</style>
