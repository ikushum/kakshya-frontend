<template>
  <v-container>
    <v-col
      class="text-center py-0"
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
          lg="6"
          sm="10"
          xs="10"
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
              <v-card>
                <v-bottom-navigation
                  dark
                >
                  <v-btn>
                    <span>PDF Viewer</span>
                    <v-icon>mdi-television-play</v-icon>
                  </v-btn>
                </v-bottom-navigation>                
                <!-- <v-toolbar dark/> -->
                <v-card-text 
                  v-if="pdf.uploadProgress.sharing"
                >
                  <v-progress-circular
                    :rotate="-90"
                    :size="100"
                    :width="15"
                    :value="getUploadProgress()"
                    color="primary"
                  >
                    {{ Math.round(getUploadProgress()) }} %
                  </v-progress-circular>
                  <div>The class creator is uploading a file</div>
                </v-card-text>                
                <v-card-text
                  v-else-if="!pdf.fileUrl" 
                  class="my-6"
                >
                  <div v-if="isClassCreator">
                    You Haven't uploaded a pdf yet
                    <v-file-input 
                      v-model="pdf.file"
                      accept=".pdf"
                      label="Upload a pdf"
                    />
                    <v-btn
                      :disabled="!pdf.file"
                      depressed
                      color="primary"
                      @click="uploadPdf()"
                    >
                      Upload
                    </v-btn>
                  </div>
                  <div v-else>
                    PDF has not been uploaded yet
                  </div>
                </v-card-text>
                <template
                  v-else
                >
                  <v-card-text
                    class="black"
                  >
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
            </v-col>
          </v-row>
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
  </v-container>
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
      message: '',
      messages: [],
      pdf: {
        file: null,
        fileUrl: '',
        currentPage: 1,
        totalPages: null,
        showFullscreen: false,
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
  methods: {
    getUploadProgress () {
      return 100 -((this.pdf.uploadProgress.remainingChunk / this.pdf.uploadProgress.totalChunk) *100)
    },
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
