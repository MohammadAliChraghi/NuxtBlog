<template>
  <v-app>
    <v-row>
      <v-navigation-drawer
        class="rounded-0"
        :mini-variant.sync="mini"
        permanent
      >
        <v-list-item>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-{{ chevron }}</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider />
        <v-list v-for="item in list_item" :key="item.id" dense class="pl-1">
          <v-list-item link>
            <nuxt-link :to="`/dashboard/${item.link}`">
              <v-icon>mdi-{{ item.icon }}</v-icon>
              <v-list-item-content class="pl-5">{{
                item.name
              }}</v-list-item-content>
            </nuxt-link>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-col>
        <Nuxt />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      mini: true,
      i_route: "",
      list_item: [
        {
          id: 1,
          link: "",
          icon: "home-analytics",
          name: "Dashboard",
        },
        {
          id: 2,
          link: "users",
          icon: "account-group",
          name: "Users",
        },
        {
          id: 5,
          link: "posts",
          icon: "text-box",
          name: "Posts",
        },
      ],
    };
  },
  computed: {
    chevron() {
      return this.mini ? "left" : "right";
    },
  },
};
</script>

<style>
.v-navigation-drawer{
  height: initial !important;
}
a {
  text-decoration: none;
}
.v-list-item a {
  color: white;
  display: flex;
}
</style>
