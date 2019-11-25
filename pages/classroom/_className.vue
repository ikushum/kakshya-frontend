<template>
  <v-container>
    <v-col
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
          <v-row
            v-if="isClassCreator"
            cols="12"
          >
            <v-col
              cols="6"
            >
              <v-card
                class="mx-auto"
                tile
              >
                <v-list flat>
                  <v-subheader>Join Requests</v-subheader>
                  <v-list-item
                    v-for="(request, index) in joinRequests"
                    :key="index"
                    class="text-left"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="request.user.fullname" />
                    </v-list-item-content>
                    <v-list-actions>
                      <v-btn 
                        depressed
                        dark
                        fab
                        x-small
                        color="green"
                        @click="reactToJoinRequest(true, request.socket_id, index)"
                      >
                        <v-icon v-text="'mdi-check'" />
                      </v-btn>
                      <v-btn 
                        depressed
                        dark
                        fab
                        x-small
                        color="red"
                        @click="reactToJoinRequest(false, request.socket_id, index)"
                      >
                        <v-icon v-text="'mdi-close'" />
                      </v-btn>
                    </v-list-actions>
                  </v-list-item>
                  <div 
                    v-if="!joinRequests.length"
                    class="text-left px-4"
                  >
                    No users have requested to join at the moment
                  </div>                  
                </v-list>
              </v-card>            
            </v-col>
            <v-col
              cols="6"
            >
              <v-card
                class="mx-auto"
                tile
              >
                <v-list flat>
                  <v-subheader>Joind Users</v-subheader>
                  <v-list-item
                    v-for="(request, i) in joinedUsers"
                    :key="i"
                    class="text-left"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="request.user.fullname" />
                    </v-list-item-content>
                  </v-list-item>
                  <div 
                    v-if="!joinedUsers.length"
                    class="text-left px-4"
                  >
                    No Users have joined yet
                  </div>
                </v-list>
              </v-card>            
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="6">
              <v-card
                v-if="!isClassCreator && !isApproved"
              >
                <v-card-text class="pa-6">
                  <v-progress-circular
                    :size="100"
                    :width="7"
                    color="primary"
                    class="mb-10"
                    indeterminate
                  />
                  <div class="title">
                    Waiting for approval from class creator
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="(isClassCreator || isApproved) && lifecycle.isClassAvailable">
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
  middleware: 'auth',
  data () {
    return {
      classDetails: {},
      joinRequests: [],
      joinedUsers: [],
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
    createClassRecord(name) {
      let formValues = {
        name,
        created_by: this.$auth.user._id
      }
      this.$axios.$post('/api/class', formValues)
        .then((response) => {
          this.classDetails = response.result
        })
    },
    joinClassRecord(userId) {
      let formValues = {
        joined_by: userId
      }
      this.$axios.$patch(`/api/class/${this.classDetails._id}`, formValues)
        .then(() => {
          // this.classDetails = response
        })
    },
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
    leaveClass () {
      this.resetStream()
      this.roomName = ''
    }
  }
}
</script>
