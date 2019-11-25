<template>
  <div>
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
    <ValidationObserver ref="observer">
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|email"
        name="Email"
      >      
        <v-text-field
          v-model="formValues.email"
          label="Email"
          :error="!!errors.length"
          :error-messages="errors"        
        />
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        name="Password"
      >           
        <v-text-field
          v-model="formValues.password"
          label="Password"
          type="password"
          :error="!!errors.length"
          :error-messages="errors"              
        />
        <h3 
          class="body-2 ma-3 grey--text"
        >
          Forgot Password ?
        </h3>
        <v-btn
          depressed
          x-large
          class="px-12 my-2"
          color="primary"
          rounded
          dark
          @click="login()"
        >
          Log In
        </v-btn>        
      </ValidationProvider>
    </ValidationObserver>
  </div>
</template>

<script>
import VeeValidate from '@/mixins/veeValidate'
export default {
  layout: 'accounts',
  mixins: [VeeValidate],
  data () {
    return {
      formValues: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      if (await this.validateAllFields()) {
        this.$auth.loginWith('local', {
          data: this.formValues
        })
        .then(() => {
          this.$router.push('/')
        })
      }   
    }
  }
}
</script>

