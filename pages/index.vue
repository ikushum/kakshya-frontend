<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      lg="6"
      sm="10"
      xs="10" 
      class="text-center"
    >
      <h1> Kakshya </h1>
      <v-text-field
        v-model="className"
        label="Enter Class Room Name"
      />
      <v-btn
        color="primary"
        :disabled="!className"
        depressed
        @click="createClass()"
        v-text="'Create'"
      />
      <span
        class="ml-4 secondary--text"
        v-text="'Or'"
      />
      <v-btn
        color="primary"
        text
        :disabled="!className"
        @click="joinClass()"
        v-text="'Join'"
      />
    </v-col>
    <v-snackbar
      v-model="snackbar.display"
      :color="snackbar.color"
      right
    >
      <span
        v-text="snackbar.text"
      />
    </v-snackbar>
  </v-row>
</template>

<script>
  export default {
    middleware: 'auth',
    data () {
      return {
        className: '',
        snackbar: {
          color: 'success',
          display: false,
          text: ''
        }
      }
    },
    mounted () {
      this.checkMetaData()
    },
    methods: {
      createClass () {
        this.$router.push({
          name: 'classroom-className',
          query: { as: 'creator' },
          params: { className: this.className }
        })
      },
      joinClass () {
        this.$router.push({
          name: 'classroom-className',
          query: { as: 'guest' },
          params: { className: this.className }
        })        
      },
      checkMetaData () {
        const query = this.$route.query
        if (!query.metaRoom || !query.metaMsg) return
        if (query.metaMsg === 'full') {
          this.snackbar = {
            display: true,
            text: 'Room ' + query.metaRoom + ' is not available',
            color: 'error'
          }
        }
        if (query.metaMsg === 'notFound') {
          this.snackbar = {
            display: true,
            text: 'Room ' + query.metaRoom + ' not found',
            color: 'error'
          }  
        }
      }      
    }
  }
</script>
