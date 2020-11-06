<template>
  <div class="pa-3">
    <br />
    <div
      class="rounded"
      v-if="post.thumbnail.length"
      :src="`/${post.thumbnail}`"
      :style="
        'background-image: url(/' +
          post.thumbnail +
          ');background-size: cover;height: 86vh;display: flex'
      "
    >
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1
            class="display-1 font-weight-thin mb-4"
            style="text-shadow: 2px 2px 2px black;"
          >
            {{ post.title }}
          </h1>
          <h4 class="subheading" style="text-shadow: 2px 2px 2px black;">
            By {{ post.author }}
          </h4>
        </v-col>
      </v-row>
    </div>
    <br />
    <v-sheet elevation="4" class="pa-4 rounded" style="text-align: justify">{{
      post.text
    }}</v-sheet>
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
  head() {
    return {
      title: this.post.title,
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
