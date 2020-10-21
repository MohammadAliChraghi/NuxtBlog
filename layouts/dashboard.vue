<template>
  <v-app>
    <v-system-bar color="accent" lights-out>
      <v-spacer></v-spacer><v-icon color="gray">mdi-email</v-icon
      ><v-badge dot overlap></v-badge>
    </v-system-bar>
    <v-row>
      <v-navigation-drawer
        class="rounded-0"
        :mini-variant.sync="mini"
        permanent
      >
        <v-list-item>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider />
        <v-list dense class="pl-1">
          <v-list-item link>
            <v-icon>mdi-email</v-icon>
            <v-list-item-content class="pl-5">Simple</v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
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
    };
  },
};
</script>
