<template>
  <div class="pr-4">
    <div class="pb-6">
      <v-btn color="error" @click="Action_User('Delete')">Delete</v-btn>
    </div>
    <div class="pb-5">
      <v-simple-table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.password }}</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>

    <v-text-field v-model="user.username" label="Username"></v-text-field>
    <v-text-field v-model="user.password" label="Password"></v-text-field>
    <v-select v-model="user.role" :items="roles"></v-select
    ><v-btn color="primary" @click="Action_User('Update')">Update</v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  layout: "dashboard",
  data() {
    return {
      roles: ["admin", "author", "visitor"],
      p_id: this.$route.params.id,
      user: {},
    };
  },
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id);
  },
  head(){
    return{
      title: `User ${this.user.username}`
    }
  },
  methods: {
    async Action_User(t) {
      console.warn(this.user.id);
      if (t === "Update") {
        await axios({
          method: "post",
          url: `http://localhost:3000/api/users/${this.user.id}`,
          headers: { authorization: this.$cookiz.get("token") },
          data: { user: this.user, type: "UPDATE" },
        })
          .then(async (r) => {
            alert(`${this.user.username} Succefuly Updated`);
          })
          .catch((e) => console.error(e));
      } else if (t === "Delete") {
        await axios
          .delete(`http://localhost:3000/api/users/${this.user.id}`, {
            headers: { authorization: this.$cookiz.get("token") },
          })
          .then((r) => {
            alert(`${this.user.username} Succefuly Deleted`);
            this.$router.go("/dashboard/users");
          })
          .catch((e) => {
            console.error("User NoT Found!");
            this.$router.go("/dashboard/users");
          });
      }
    },
  },
  async fetch() {
    await axios
      .get(`http://localhost:3000/api/users/${this.p_id}`, {
        headers: { authorization: this.$cookiz.get("token") },
      })
      .then((r) => {
        this.user = r.data[0];
      });
  },
  fetchOnServer: false,
};
</script>
