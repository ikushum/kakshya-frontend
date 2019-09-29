<template>
  <v-col
    cols="12"
    class="text-center"
  >
    <h1> Kakshya </h1>
    <v-btn
      color="primary"
      text
      @click="$router.push('/classroom')"
      v-text="'Get Started'"
    />
  </v-col>
</template>

<script>
  export default {}
</script>
