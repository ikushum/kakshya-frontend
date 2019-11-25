<template>
  <v-container 
    v-if="classDetails"
    class="px-12"
  >
    <div class="display-1">
      Name : <b> Test </b>
    </div>
    <div
      class="subtitle-1"
    >
      Total Attendance: 
      <b> {{ classDetails.classRoom.joined_by.length }}</b>
    </div>  
    <div
      class="caption grey--text"
    >
      Created At: 
      <b> {{ humanize(classDetails.classRoom.created_at) }}</b>
    </div>
    <div class="my-12">
      <p class="title grey--text">
        Created By
      </p>
      <v-card>
        <v-card-text>
          <v-list-item two-line>
            <v-list-item-avatar class="orange white--text subtitle-2">
              {{ classDetails.created_by[0].fullname.split(' ')[0][0] }}
              {{ classDetails.created_by[0].fullname.split(' ')[1][0] }}
            </v-list-item-avatar>            
            <v-list-item-content>
              <v-list-item-title>{{ classDetails.created_by[0].fullname }}</v-list-item-title>
              <v-list-item-subtitle>{{ classDetails.created_by[0].email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>          
        </v-card-text>
      </v-card>
    </div>
    <div class="my-12">
      <p class="title grey--text">
        Joined By
      </p>
      <v-card>
        <v-card-text>
          <div
            v-if="!classDetails.joined_by.length"
            class="title"
          >
            <v-icon
              size="50"
              class="mr-5"
              v-text="'mdi-file-document-box-search'"
            />
            No users joined this class
          </div>
          <v-list-item
            v-for="user in classDetails.joined_by"
            :key="user._id" 
            two-line
          >
            <v-list-item-avatar class="orange white--text subtitle-2">
              {{ user.fullname.split(' ')[0][0] }}
              {{ user.fullname.split(' ')[1][0] }}
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ user.fullname }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>          
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      classDetails: null
    }
  },
  created () {

    this.fetchClassDetails()
  },
  methods: {
    fetchClassDetails () {
      this.$axios.get(`/api/class/${this.$route.params.id}`)
        .then(response => {
          this.classDetails = response.data
        })
    },
    humanize (date) {
      return moment(date).format('MMMM Do YYYY, h:mm a')
    }
  }
}
</script>

