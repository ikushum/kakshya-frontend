<template>
  <v-row
    class="fill-height"
  >
    <v-col 
      cols="5"
      class="primaryz px-12"
    >
      <v-row
        class="white--text fill-height"
      >
        <v-col
          align-self="center"
          cols="12"
          class="px-12"
        >
          <h1
            class="display-3 font-weight-bold my-3"
          >
            Kakshya
          </h1>
          <h3 class="subtitle-1 my-6">
            A complete digital clone of real world classroom
            <br> just a few clicks away
          </h3>

          <v-btn
            x-large
            outlined
            class="px-12"
            rounded
            dark
          >
            Register
          </v-btn>  
        </v-col>
      </v-row>
    </v-col>
    <v-col 
      class="px-12"
      cols="7"
    >
      <v-row
        justify="left"
        class="px-12 primary--text fill-height"
      >
        <v-col
          align-self="center"
          cols="9"
        >
          <div
            class="my-6"
          >
            <h1 
              class="display-1"
            >
              Log In to <b>Kakshya</b>
            </h1>
            <h4
              class="subtitle-1 grey--text"
            >
              Please enter your email and password
            </h4>
          </div>
          <v-text-field
            label="Email"
          />
          <v-text-field
            label="Password"
            type="password"
          />
          <h3 
            class="body-2 myweb-6 grey--text"
          >
            Forgot Password ?
          </h3>
          <v-btn
            depressed
            x-large
            class="px-12 my-6"
            color="primary"
            rounded
            dark
          >
            Log In
          </v-btn>              
        </v-col>
      </v-row> 
    </v-col>
  </v-row>
</template>

<script>
export default {

}
</script>

<style
  scoped
>
  .primaryz{
    background-image: url('https://ak3.picdn.net/shutterstock/videos/26156363/thumb/1.jpg');
    background-size: cover;
  }
</style>