<template>
  <v-container class="px-12">
    <v-row
      justify="center"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-avatar
          color="orange"
          size="70"
        >
          <span class="white--text headline">
            {{ $auth.user.fullname.split(' ')[0][0] }}
            {{ $auth.user.fullname.split(' ')[1][0] }}
          </span>
        </v-avatar>

        <h1>{{ $auth.user.fullname }}</h1>
        <h3 class="subtitle-1">
          {{ $auth.user.email }}
        </h3>
      </v-col>
      <v-col
        cols="12"
      >
        <p class="title grey--text">
          Classes Created
        </p>
        <v-card>
          <v-card-text class="px-12">
            <v-timeline
              dense
            >
              <v-timeline-item
                v-for="(classRoom, index) in userInfo.created_classes"
                :key="index"
                :color="colors[index % 2]"
                small
              >
                <v-row align="center">
                  <v-col cols="3">
                    <div
                      :class="`font-weight-bold`"
                      v-text="humanizeDate(classRoom.created_at, 'MMMM Do YYYY')"
                    />
                    <span
                      :class="`caption`"
                      v-text="humanizeDate(classRoom.created_at, 'h:mm a')"
                    />
                  </v-col>
                  <v-col>
                    <h2 :class="`headline font-weight-bold`">
                      {{ classRoom.name }}
                    </h2>
                    <span
                      :class="`caption`"
                    >
                      Total Attendance: 
                      <b> {{ classRoom.joined_by.length }}</b>
                    </span>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn
                      color="primary"
                      outlined
                      small
                      @click="$router.push(`/classroom/details/${classRoom._id}`)"
                      v-text="'View Details'"
                    />
                  </v-col>                  
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
      >
        <p class="title grey--text">
          Classes Joined
        </p>      
        <v-card>
          <v-card-text class="px-12">
            <v-timeline
              dense
            >
              <v-timeline-item
                v-for="(classRoom, index) in userInfo.joined_classes"
                :key="index"
                :color="colors[index % 2]"
                small
              >
                <v-row align="center">
                  <v-col cols="3">
                    <div
                      :class="`font-weight-bold`"
                      v-text="humanizeDate(classRoom.created_at, 'MMMM Do YYYY')"
                    />
                    <span
                      :class="`caption`"
                      v-text="humanizeDate(classRoom.created_at, 'h:mm a')"
                    />
                  </v-col>
                  <v-col>
                    <h2 :class="`headline font-weight-bold`">
                      {{ classRoom.name }}
                    </h2>
                    <span
                      :class="`caption`"
                    >
                      Total Attendance: 
                      <b> {{ classRoom.joined_by.length }}</b>
                    </span>                    
                  </v-col>
                  <v-col class="text-right">
                    <v-btn
                      color="primary"
                      outlined
                      small
                      @click="$router.push(`/classroom/details/${classRoom._id}`)"
                      v-text="'View Details'"
                    />
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>    
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      userInfo: {},
      colors: ['primary', 'grey']
    }
  },
  created () {
    this.fetchUser()
  },
  methods: {
    fetchUser() {
      this.$axios.$get('/api/me/')
        .then(response => {
          console.log(response)
          this.userInfo = response
        })
    },
    humanizeDate(date, format) {
      return moment(date).format(format)
    }
  }
}
</script>

<style>

</style>
