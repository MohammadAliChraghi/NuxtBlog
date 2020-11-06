<template>
  <div class="px-3">
    <v-row>
      <v-col cols="12" md="4" lg="3" sm="12" v-for="i in posts" :key="i.id"
        ><v-card
          ><v-card-title
            ><nuxt-link :to="`/p/${i.id}`">{{
              i.title
            }}</nuxt-link></v-card-title
          >
          <v-img :src="i.thumbnail"></v-img>
          <v-card-subtitle>By {{ i.author }}</v-card-subtitle>
          <v-card-text>{{ i.text.substring(0, 100) }}...</v-card-text></v-card
        ></v-col
      >
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      posts: [],
    };
  },
  async fetch() {
    await axios({
      method: "get",
      url: "http://localhost:3000/api/posts",
      headers: { authorization: this.$cookiz.get("token") },
    })
      .then(async (r) => {
        this.posts = r.data;
        for (let i = 0; i < this.posts.length; i++) {
          await axios({
            url: `http://localhost:3000/api/users/${this.posts[i].author}`,
            headers: { authorization: this.$cookiz.get("token") },
          })
            .then((r) => {
              this.posts[i].author = r.data[0].username;
            })
            .catch((e) => {
              console.error(e);
            });
        }
      })
      .catch((e) => console.error(e));
  },
  fetchOnServer: false,
};
</script>

<style>
.v-responsive__sizer {
  padding-bottom: 20vh !important;
}
</style>
