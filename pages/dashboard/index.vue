<template>
  <div>
    <v-row class="pr-6">
      <v-col cols="12" md="6" lg="4" class="pt-0 pr-0">
        <v-card elevation="3" class="text-center py-5" color="accent">
          <h2>Total Visits Is {{ visits.total }}</h2></v-card
        >
      </v-col>

      <v-col cols="12" md="6" lg="4" class="pt-0 pr-0">
        <v-card elevation="3" class="text-center py-5" color="accent">
          <h2>Today Visits Is {{ visits.day }}</h2></v-card
        >
      </v-col>

      <v-col cols="12" md="6" lg="4" class="pt-0 pr-0">
        <v-card elevation="3" class="text-center py-5" color="accent">
          <h2>This Year Visits In Month</h2>
          <v-sparkline
            :value="year_value"
            smooth="10"
            line-width="2"
            :fill="false"
            type="trend"
            auto-draw
            ><template v-slot:label="i"> {{ i.value }} </template>
          </v-sparkline>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pr-6">
      <v-col cols="12" lg="6" class="pt-0 pr-0"
        ><v-card
          ><v-card-title
            ><v-icon class="pr-3">mdi-text-box</v-icon>Last Posts</v-card-title
          >
          <hr />
          <v-card-text>
            <ul>
              <li v-for="i in last_posts" :key="i.id">
                <a :href="`/dashboard/posts/${i.id}`"
                  ><h3>{{ i.title }}</h3></a
                >
              </li>
            </ul>
          </v-card-text>
        </v-card></v-col
      >
      <v-col cols="12" lg="6" class="pt-0 pr-0"
        ><v-card
          ><v-card-title
            ><v-icon class="pr-3">mdi-account-group</v-icon>Last
            Users</v-card-title
          >
          <hr />
          <v-card-text>
            <ul>
              <li v-for="i in last_users" :key="i.id" class="pb-3">
                <a :href="`/dashboard/users/${i.id}`"
                  ><h2>
                    « {{ i.username }} » <b> {{ i.role.toUpperCase() }}</b>
                  </h2></a
                >
              </li>
            </ul>
          </v-card-text>
        </v-card></v-col
      >
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  layout: "dashboard",
  data() {
    return {
      last_users: [],
      last_posts: [],
      token: this.$cookiz.get("token"),
      visits: {
        total: "",
        day: "",
        year: [
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
          { 0: 0 },
        ],
      },
      date: {
        year: new Date(Date.now()).getFullYear(),
        month: new Date(Date.now()).getMonth() + 1,
        day: new Date(Date.now()).getDate(),
      },
    };
  },
  computed: {
    year_value() {
      return Object.keys(this.visits.year).map(
        (key) => this.visits.year[key][0]
      );
    },
  },
  async fetch() {
    await axios
      .get("http://localhost:3000/api/posts", {
        headers: { limit: 5, authorization: this.token },
      })
      .then((r) => {
        this.last_posts = r.data;
      });
    await axios
      .get("http://localhost:3000/api/users", {
        headers: { limit: 5, authorization: this.token },
      })
      .then((r) => {
        this.last_users = r.data;
      });
    await axios
      .get("http://localhost:3000/api/statics/visits", {
        headers: { authorization: this.token },
      })
      .then((r) => {
        this.visits.total = r.data;
      });
    await axios
      .get(
        `http://localhost:3000/api/statics/visits/${this.date.year}/${this.date.month}/${this.date.day}`,
        {
          headers: { authorization: this.token },
        }
      )
      .then((r) => {
        this.visits.day = r.data;
      });
    await axios
      .get(`http://localhost:3000/api/statics/visits/${this.date.year}`, {
        headers: { type: "rows", authorization: this.token },
      })
      .then((r) => {
        for (let i = 0; i < r.data.length; i++) {
          let visit_m = new Date(r.data[i].date).getMonth() + 1;
          this.visits.year[visit_m.toString() - 1][0] += 1;
        }
      });
  },

  fetchOnServer: false,
};
</script>

<style scoped>
hr {
  border-color: rgba(55, 55, 253, 0.596);
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 400;
}
</style>
