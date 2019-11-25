<template>
  <v-card>
    <v-card-text 
      style="max-height:50vh;overflow:auto"
      class="text-left"
    >
      <div v-if="!messages.length">
        The classroom has not recieved any messages
      </div>
      <div v-else>
        <v-list>
          <v-list-item 
            v-for="(msg, index) in messages"
            :key="index"                    
            two-line
          >
            <v-list-item-content>
              <v-list-item-subtitle
                :class="{'blue--text' : msg.isCreator}"
                v-text="msg.isCreator ? 'Creator' : 'Guest'"
              />
              <v-list-item-title>{{ msg.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <div
        id="chatBox"
      />
    </v-card-text>
    <v-divider />
    <v-card-actions class="px-6">
      <v-text-field
        v-model="message"
        label="Enter Your Message"
        @keypress.enter="$emit('send', message), message = ''"
      />                  
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      message: ''
    }
  }
}
</script>

<style>

</style>
