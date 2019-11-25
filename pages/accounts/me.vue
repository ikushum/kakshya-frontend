<template>
  <v-row
    justify="center"
  >
    <v-cols
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
    </v-cols>
  </v-row>
</template>

<script>
export default {

}
</script>

<style>

</style>
