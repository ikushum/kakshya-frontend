<template>
  <v-col
    class="text-center"
  >
    <v-row
      justify="center"
    >
      <v-col
        v-if="!lifecycle.isClassRequested"
        cols="6"
      >
        <v-text-field
          v-model="roomName"
          label="Enter Class Room Name"
        />
        <v-btn
          color="primary"
          :disabled="!roomName"
          depressed
          @click="createClassRoom()"
          v-text="'Create'"
        />
        <span
          class="ml-4 secondary--text"
          v-text="'Or'"
        />
        <v-btn
          color="primary"
          text
          :disabled="!roomName"
          @click="joinClassRoom()"
          v-text="'Join'"
        />
      </v-col>
      <v-col
        v-else
        cols="6"
        class="text-center"
      >
        <v-progress-circular
          v-if="!lifecycle.videoAvailable"
          :size="50"
          color="primary"
          indeterminate
        />
        <v-bottom-navigation
          v-model="currentView"
          dark
          shift
        >
          <v-btn>
            <span>Video</span>
            <v-icon>mdi-television-play</v-icon>
          </v-btn>

          <v-btn>
            <span>Slide</span>
            <v-icon>mdi-presentation</v-icon>
          </v-btn>

          <v-btn>
            <span>Q&A</span>
            <v-icon>mdi-comment-question-outline</v-icon>
          </v-btn>
        </v-bottom-navigation>     
        <video
          v-show="lifecycle.videoAvailable && currentView === 0"
          id="videoElement"
          autoplay
          :muted="isClassCreator"
          playsinline
        />        

        <!-- <div
          class="my-3"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                slot="activator"
                color="error"
                fab
                v-on="on"
                @click="leaveClass"
              >
                <v-icon>
                  mdi-exit-to-app
                </v-icon>
              </v-btn>
            </template>            

            <span v-text="isClassCreator ? 'Exit Room' : 'Leave Room'" />
          </v-tooltip>
        </div> -->
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.display"
      :color="snackbar.color"
      right
    >
      <span
        v-text="snackbar.text"
      />
    </v-snackbar>    
  </v-col>
</template>

<script>
import videoStreamer from '@/mixins/videoStreamer'
export default {
  mixins: [videoStreamer],
  data () {
    return {
      currentView: 0,
      roomName: '',
      snackbar: {
        color: 'success',
        display: false,
        text: ''
      }
    }
  },
  methods: {
    leaveClass () {
      this.resetStream()
      this.roomName = ''
    },
  }
}
</script>
