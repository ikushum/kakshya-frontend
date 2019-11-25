<template>
  <div>
    <div
      class="my-6"
    >
      <h1 
        class="display-1"
      >
        Sign Up to <b>Kakshya</b>
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
        rules="required"
        name="Full Name"
      >
        <v-text-field
          v-model="formValues.fullname"
          label="Full Name"
          :error="!!errors.length"
          :error-messages="errors"
        />
      </ValidationProvider>
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
      </ValidationProvider>
      <v-btn
        depressed
        x-large
        class="px-12 my-6"
        color="primary"
        rounded
        dark
        @click="signup()"
      >
        Sign Up
      </v-btn>
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
        fullname: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signup () {
      if (await this.validateAllFields()) {
        this.$axios.$post('/api/signup', this.formValues)
        .then(response => {
          this.$router.push('/accounts/login/')
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
      }
    }    
  }    
}
</script>

