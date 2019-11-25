<template>
  <v-app>
    <v-navigation-drawer
      app
      clipped
    >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="$router.push(item.link)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>    
    <v-app-bar
      color="primary"
      dense
      dark
      app
      clipped-left
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
    <v-content>
      <nuxt class="mt-12" />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { title: 'Home', icon: 'mdi-home-circle-outline', link: '/' },
        { title: 'User Profile', icon: 'mdi-account-outline', link: 'accounts/me' }
      ]
    }  
  }
}
</script>

