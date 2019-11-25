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
              <chat-section
                v-if="currentView === 1"
                :messages="messages"
                @send="sendTextMessage"
              />
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
import ChatSection from '@/components/classroom/ChatSection'
export default {
  components: {PdfViewer, ChatSection},
  mixins: [videoStreamer],
  data () {
    return {
      currentView: 0,
      roomName: this.$route.params.className,
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
