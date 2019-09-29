<template>
  <v-col
    class="text-center"
  >
    <v-btn
      text
      @click="$router.push('/')"
      v-text="'Goto Home'"
    />
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
        <video
          v-show="lifecycle.videoAvailable"
          id="videoElement"
          autoplay
          :muted="isClassCreator"
          playsinline
        />
        <div
          class="my-3"
        >
          <v-btn
            color="error"
            text          
            @click="leaveClass"
            v-text="'Leave Class'"
          />
        </div>
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
