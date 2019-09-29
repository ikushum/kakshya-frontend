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
        v-if="!initialized"
        cols="6"
      >
        <v-text-field
          v-model="roomName"
          label="Enter Class Name"
        />
        <v-btn
          class="primary"
          :disabled="!roomName"
          @click="initializeStream()"
          v-text="'Join or Create'"
        />
      </v-col>
      <v-col
        v-else
        cols="6"
      >
        <video 
          v-show="isInitiator"
          id="videoElement"
          autoplay
          muted
          playsinline
        />
        <video 
          v-show="!isInitiator"
          id="remoteVideo"
          autoplay
          :muted="isInitiator"
          playsinline
        />
        <v-btn
          color="red"
          dark
          @click="leaveClass"
          v-text="'Leave Class'"
        />   
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import videoStreamer from '@/mixins/videoStreamer'
export default {
  mixins: [videoStreamer],
  data () {
    return {
      roomName: ''
    }
  },
  methods: {
    leaveClass () {
      this.initialized = false
      this.roomName = ''
    }
  }
}
</script>
