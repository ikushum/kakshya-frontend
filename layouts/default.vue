<template>
  <v-app>
    <v-app-bar
      color="primary"
      dense
      dark
      app
    >
      <v-toolbar-title
        @click="$router.push('/')"      
      >
        <v-btn
          class="title  text-capitalize"
          text
        >
          Kakshya
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-menu
        left
        bottom
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn 
            icon
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>View Profile</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="$auth.logout()"
          >
            <v-list-item-title>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>      
    </v-app-bar>
    <nuxt class="mt-12" />
  </v-app>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
