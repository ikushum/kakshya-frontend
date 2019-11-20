<template>
  <v-col
    class="text-center"
  >
    <v-dialog
      v-if="pdf.showFullscreen"
      v-model="pdf.showFullscreen"
      fullscreen
      scrollable
    >
      <v-card
        dark
      >
        <v-toolbar
          dark
          height="50"
          color="primary"
        >
          <v-toolbar-title>
            Page {{ pdf.currentPage }} of {{ pdf.totalPages }}
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              :disabled="pdf.currentPage === 1"
              depressed
              color="primary"
              @click="pdf.currentPage -= 1"
            >
              Previous
            </v-btn>
            <v-btn
              :disabled="pdf.currentPage === pdf.totalPages"
              depressed
              color="primary"
              @click="pdf.currentPage += 1"
            >
              Next
            </v-btn>
          </v-toolbar-items>
          <v-spacer />
          <v-btn
            icon
            dark
            @click="pdf.showFullscreen = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>          
        </v-toolbar>
        <v-card-text>      
          <div class="d-flex justify-center">
            <vue-pdf
              style="width:50%"
              :src="pdf.fileUrl" 
              :page="pdf.currentPage"
              @error="logPdfStatus"
              @progress="logPdfStatus('pdf-loading')"
              @loaded="logPdfStatus('pdf-loaded')"
            />     
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row
      justify="center"
    >
      <v-col
        v-if="!lifecycle.isClassRequested"
        cols="6"
      >
        <v-text-field
          v-model="roomName"
          label="Enter Class Room Name"
        />
        <v-btn
          color="primary"
          :disabled="!roomName"
          depressed
          @click="createClassRoom()"
          v-text="'Create'"
        />
        <span
          class="ml-4 secondary--text"
          v-text="'Or'"
        />
        <v-btn
          color="primary"
          text
          :disabled="!roomName"
          @click="joinClassRoom()"
          v-text="'Join'"
        />
      </v-col>
      <v-col
        v-else
        cols="6"
        class="text-center"
      >
        <v-bottom-navigation
          v-model="currentView"
          dark
        >
          <v-btn>
            <span>Video</span>
            <v-icon>mdi-television-play</v-icon>
          </v-btn>

          <v-btn>
            <span>Slide</span>
            <v-icon>mdi-presentation</v-icon>
          </v-btn>

          <v-btn>
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
          v-show="currentView === 1"
        >
          <v-card-text v-if="!pdf.fileUrl">
            You Haven't uploaded a pdf yet
            <v-file-input 
              v-model="pdf.file"
              accept=".pdf"
              label="Upload a pdf"
            />
            <v-btn
              depressed
              color="primary"
              @click="uploadPdf()"
            >
              Upload
            </v-btn>
          </v-card-text>
          <template
            v-else
          >
            <v-card-text
              class="black"
            >
              <!-- 
                todo @ishan when remote uploads pdf and the local 
                user is in video(or any other tab), the uploaded
                pdf is blank
               -->
              <vue-pdf
                :src="pdf.fileUrl"
                :page="pdf.currentPage"
                @num-pages="pdf.totalPages = $event" 
                @error="logPdfStatus"
                @progress="logPdfStatus('pdf-loading')"
                @loaded="logPdfStatus('pdf-loaded')"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                depressed
                :disabled="pdf.currentPage === 1"
                color="primary"                
                @click="pdf.currentPage -= 1"
              >
                Previous
              </v-btn>
              <v-spacer />
              <v-btn
                icon
                @click="pdf.showFullscreen = true"
              >
                <v-icon v-text="'mdi-fullscreen'" />
              </v-btn>
              <v-spacer />              
              <v-btn
                depressed
                :disabled="pdf.currentPage === pdf.totalPages"
                color="primary"                
                @click="pdf.currentPage += 1"
              >
                Next
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
        <div
          class="my-3"
        >
          <v-btn
            color="red"
            text
            @click="leaveClass"
            v-text="isClassCreator ? 'Exit Room' : 'Leave Room'"
          />
        </div>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.display"
      :color="snackbar.color"
      right
    >
      <span
        v-text="snackbar.text"
      />
    </v-snackbar>    
  </v-col>
</template>

<script>
import videoStreamer from '@/mixins/videoStreamer'
import VuePdf from 'vue-pdf'
export default {
  components: {VuePdf},
  mixins: [videoStreamer],
  data () {
    return {
      currentView: 0,
      roomName: '',
      pdf: {
        file: null,
        fileUrl: '',
        currentPage: 1,
        totalPages: null,
        showFullscreen: false
      },
      snackbar: {
        color: 'success',
        display: false,
        text: ''
      }
    }
  },
  methods: {
    logPdfStatus(param) {
      console.log(param)
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
