<template>
  <v-app>
    <v-navigation-drawer
      app
      clipped
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar class="orange white--text subtitle-2">
            {{ $auth.user.fullname.split(' ')[0][0] }}
            {{ $auth.user.fullname.split(' ')[1][0] }}
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ $auth.user.fullname }}</v-list-item-title>
            <v-list-item-subtitle>{{ $auth.user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>    
      <v-divider />
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          exact
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
          class="title text-capitalize"
          text
        >
          <v-icon
            class="mr-3"
            v-text="'mdi-school'"
          />            
          Kakshya
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-menu
        left
        bottom
        dark
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
            <v-list-icon>
              <v-icon
                left
                v-text="'mdi-account-outline'"
              />
            </v-list-icon>
            <v-list-item-title>View Profile</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="$auth.logout()"
          >
            <v-list-item-title>
              <v-list-icon>
                <v-icon
                  left
                  v-text="'mdi-logout'"
                />
              </v-list-icon>              
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>      
    </v-app-bar>    
    <v-content class="grey lighten-5">
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
        { title: 'User Profile', icon: 'mdi-account-outline', link: '/accounts/me' },
        { title: 'About', icon: 'mdi-information-outline', link: '/about' }
      ]
    }  
  }
}
</script>

