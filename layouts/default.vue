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
