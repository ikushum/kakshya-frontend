<template>
  <v-container>
    <v-col
      v-if="lifecycle.isClassAvailable"
      class="text-center py-0"
    >
      <v-row
        justify="center"
      >
        <v-col
          cols="12"
          class="text-center"
        >
          <div class="display-1 grey--text text--darken-1 pb-2">
            Room : <b> {{ roomName }} </b>
          </div>
          <v-row>
            <v-col
              lg="6"
              sm="6"
              cols="12"
            >
              <v-bottom-navigation
                dark
              >
                <v-btn @click="currentView = 0">
                  <span>Video</span>
                  <v-icon>mdi-television-play</v-icon>
                </v-btn>
                <v-btn @click="currentView = 1">
                  <span>Q&A</span>
                  <v-icon>mdi-comment-question-outline</v-icon>
                </v-btn>
              </v-bottom-navigation>
              <v-progress-circular
                v-if="!lifecycle.videoAvailable"
                :size="50"
                color="primary"
                indeterminate
              />
              <video
                v-show="currentView === 0 && lifecycle.videoAvailable"
                id="videoElement"
                autoplay
                style="width:100%"
                :muted="isClassCreator"
                playsinline
              />
              <v-card
                v-if="currentView === 1"
              >
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
                    @keypress.enter="sendTextMessage"
                  />                  
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col
              lg="6"
              sm="6"
              cols="12"
            >
              <pdf-viewer
                :is-class-creator="isClassCreator"
                :pdf="pdf"
                @upload="pdf.file = $event, uploadPdf()"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>   
    </v-col>
    <v-snackbar
      v-model="snackbar.display"
      :color="snackbar.color"
      right
    >
      <span
        v-text="snackbar.text"
      />
    </v-snackbar>
  </v-container>
</template>

<script>
import videoStreamer from '@/mixins/videoStreamer'
import PdfViewer from '@/components/classroom/PdfViewer'
export default {
  components: {PdfViewer},
  mixins: [videoStreamer],
  data () {
    return {
      currentView: 0,
      roomName: this.$route.params.className,
      message: '',
      messages: [],
      pdf: {
        file: null,
        fileUrl: '',
        uploadProgress: {
          sharing: false,
          totalChunk: 0,
          remainingChunk: 0
        }
      },
      snackbar: {
        color: 'success',
        display: false,
        text: ''
      }
    }
  },
  beforeMount () {
    this.initializeRoom()
  },
  methods: {
    initializeRoom () {
      const permission = this.$route.query.as
      if (permission === 'creator') {
        this.createClassRoom()
      } else if (permission === 'guest') {
        this.joinClassRoom()
      } else {
        this.$router.push('/')
      }
    },
    uploadPdf () {
      this.sharePdfToClass(this.pdf.file)
      this.createFileUrl(this.pdf.file)
    },
    createFileUrl(file){
      this.pdf.fileUrl = window.URL.createObjectURL(file)
    },
    leaveClass () {
      this.resetStream()
      this.roomName = ''
    }
  }
}
</script>
