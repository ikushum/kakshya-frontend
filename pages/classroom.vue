<template>
  <v-col
    class="text-center"
  >
    <v-btn
      text
      @click="$router.push('/')"
      v-text="'Home'"
    />
    <div>
      <video 
        id="localVideo"
        autoplay
        muted
        playsinline
      />
      <video
        id="remoteVideo"
        autoplay
        playsinline 
      />
    </div>
  </v-col>
</template>

<script>
export default {

}
</script>
