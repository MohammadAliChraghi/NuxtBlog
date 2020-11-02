<template>
  <div class="pr-4">
    <v-alert v-if="action.type.length" elevation="8">
      <div v-if="action.type === 'UPDATE'">
        <v-text-field
          v-model="action.user.username"
          autofocus
          label="Username"
        ></v-text-field>
        <v-text-field
          v-model="action.user.password"
          autofocus
          label="Password"
        ></v-text-field>
        <v-select v-model="action.user.role" :items="roles"></v-select>
      </div>
      <div v-else class="pb-5">
        Are You Sure For Delete This User?
      </div>
      <v-btn :color="action.color" @click="Action_User">{{
        action.type
      }}</v-btn>
      <v-btn @click="cancel">Cancel</v-btn></v-alert
    >
    <v-simple-table>
      <thead>
        <tr>
          <th>Action</th>
          <th>ID</th>
          <th>Username</th>
          <th>Password</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in users" :key="i.id">
          <td>
            <v-btn @click="push_route(i.id)" color="primary">See</v-btn>
            <v-btn @click="user_action('del', i.id)" color="error"
              >Delete</v-btn
            >
            <v-btn @click="user_action('upd', i.id)" color="info">Update</v-btn>
          </td>
          <td>{{ i.id }}</td>
          <td>{{ i.username }}</td>
          <td>{{ i.password }}</td>
          <td>{{ i.role.toUpperCase() }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <br />
    <br />
    <hr />
    <br />
    <br />
    <v-text-field label="Username" v-model="new_user.username"></v-text-field>
    <v-text-field label="Password" v-model="new_user.password"></v-text-field>
    <v-select v-model="new_user.role" :items="roles"></v-select>
    <v-btn @click="add_user"><v-icon>mdi-plus</v-icon> Add User</v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  layout: "dashboard",
  data() {
    return {
      users: [],
      roles: ["admin", "author", "visitor"],
      new_user: { username: "", password: "", role: "visitor" },
      action: {
        type: "",
        user: { id: "", username: "", password: "", role: "" },
        color: "",
      },
    };
  },
  methods: {
    async Action_User() {
      if (this.action.type === "UPDATE") {
        await axios({
          method: "post",
          url: `http://localhost:3000/api/users/${this.action.user.id}`,
          headers: { authorization: this.$cookiz.get("token") },
          data: { user: this.action.user, type: "UPDATE" },
        })
          .then(async (r) => {
            this.action.type = "";
            alert("User Succefuly Updated");
            await axios
              .get("http://localhost:3000/api/users", {
                headers: {
                  authorization: this.$cookiz.get("token"),
                },
              })
              .then((r) => {
                this.users = r.data;
              });
          })
          .catch((e) => console.error(e));
      } else {
        await axios({
          method: "delete",
          url: `http://localhost:3000/api/users/${this.action.user.id}`,
          headers: { authorization: this.$cookiz.get("token") },
        })
          .then(async (r) => {
            alert("User Succefuly Deleted");
            this.action.type = "";
            await axios
              .get("http://localhost:3000/api/users", {
                headers: {
                  authorization: this.$cookiz.get("token"),
                },
              })
              .then((r) => {
                this.users = r.data;
              });
          })
          .catch((e) => console.error(e));
      }
    },
    cancel() {
      this.action.type = "";
      this.action.id = "";
      this.action.color = "";
    },
    async add_user() {
      await axios({
        method: "post",
        url: "http://localhost:3000/api/users",
        headers: { authorization: this.$cookiz.get("token") },
        data: { user: this.new_user },
      })
        .then(async (r) => {
          alert("User Succefuly Added");
          await axios
            .get("http://localhost:3000/api/users", {
              headers: {
                authorization: this.$cookiz.get("token"),
              },
            })
            .then((r) => {
              this.users = r.data;
            });
        })
        .catch((e) => {
          console.error(e);
        });
    },
    push_route(i) {
      this.$router.push(`/dashboard/users/${i}`);
    },
    async user_action(t, id) {
      if (t === "del") {
        this.action.type = "DELETE";
        this.action.color = "error";
        await axios
          .get(`http://localhost:3000/api/users/${id}`, {
            headers: { authorization: this.$cookiz.get("token") },
          })
          .then((r) => {
            this.action.user = r.data[0];
          })
          .catch((e) => console.error(e));
      } else {
        this.action.type = "UPDATE";
        this.action.color = "info";
        await axios
          .get(`http://localhost:3000/api/users/${id}`, {
            headers: { authorization: this.$cookiz.get("token") },
          })
          .then((r) => {
            this.action.user = r.data[0];
          })
          .catch((e) => console.error(e));
      }
    },
  },
  async fetch() {
    await axios
      .get("http://localhost:3000/api/users", {
        headers: {
          authorization: this.$cookiz.get("token"),
        },
      })
      .then((r) => {
        this.users = r.data;
      });
  },
  fetchOnServer: false,
};
</script>
