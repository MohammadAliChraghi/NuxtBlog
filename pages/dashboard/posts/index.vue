<template>
  <div class="pr-4">
    <v-simple-table>
      <thead>
        <tr>
          <th>Action</th>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in posts" :key="i.id">
          <td>
            <v-btn @click="delete_post(i.id)" color="error">Delete</v-btn>
            <nuxt-link :to="`/dashboard/posts/${i.id}`"
              ><v-btn color="orange">Edit</v-btn></nuxt-link
            >
          </td>
          <td>{{ i.id }}</td>
          <td>{{ i.title }}</td>
          <td>{{ i.author }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  layout: "dashboard",
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    async delete_post(i) {
      await axios
        .delete(`http://localhost:3000/api/posts/${i}`, {
          headers: { authorization: this.$cookiz.get("token") },
        })
        .then(async (r) => {
          alert("Post Succefuly Deleted!");
          await axios({
            method: "get",
            url: "http://localhost:3000/api/posts",
            headers: { authorization: this.$cookiz.get("token") },
          }).then(async (r) => {
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
          });
        })
        .catch((e) => console.error(e));
    },
  },
  async fetch() {
    await axios({
      method: "get",
      url: "http://localhost:3000/api/posts",
      headers: { authorization: this.$cookiz.get("token") },
    }).then(async (r) => {
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
    });
  },
  fetchOnServer: false,
};
</script>
