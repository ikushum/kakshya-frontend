<template>
  <div>
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
            v-model="file"
            accept=".pdf"
            label="Upload a pdf"
          />
          <v-btn
            :disabled="!file"
            depressed
            color="primary"
            @click="$emit('upload', file)"
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
            :page="currentPage"
            @num-pages="totalPages = $event" 
            @error="logPdfStatus"
            @progress="logPdfStatus('pdf-loading')"
            @loaded="logPdfStatus('pdf-loaded')"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            depressed
            :disabled="currentPage === 1"
            color="primary"                
            @click="currentPage -= 1"
          >
            Previous
          </v-btn>
          <v-spacer />
          <v-btn
            icon
            @click="showFullScreen = true"
          >
            <v-icon v-text="'mdi-fullscreen'" />
          </v-btn>
          <v-spacer />              
          <v-btn
            depressed
            :disabled="currentPage === totalPages"
            color="primary"                
            @click="currentPage += 1"
          >
            Next
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
    <v-dialog
      v-if="showFullScreen"
      v-model="showFullScreen"
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
            Page {{ currentPage }} of {{ totalPages }}
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              :disabled="currentPage === 1"
              depressed
              color="primary"
              @click="currentPage -= 1"
            >
              Previous
            </v-btn>
            <v-btn
              :disabled="currentPage === totalPages"
              depressed
              color="primary"
              @click="currentPage += 1"
            >
              Next
            </v-btn>
          </v-toolbar-items>
          <v-spacer />
          <v-btn
            icon
            dark
            @click="showFullScreen = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>          
        </v-toolbar>
        <v-card-text>      
          <div class="d-flex justify-center">
            <vue-pdf
              style="width:50%"
              :src="pdf.fileUrl" 
              :page="currentPage"
              @error="logPdfStatus"
              @progress="logPdfStatus('pdf-loading')"
              @loaded="logPdfStatus('pdf-loaded')"
            />     
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>    
  </div>
</template>

<script>
import VuePdf from 'vue-pdf'
export default {
  components: {VuePdf},
  props: {
    pdf: {
      type: Object,
      required: true
    },
    isClassCreator: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      file: null,
      showFullScreen: false,
      currentPage: 1,
      totalPages: null      
    }
  },
  methods: {
    logPdfStatus(param) {
      console.log(param)
    },
    getUploadProgress () {
      return 100 -((this.pdf.uploadProgress.remainingChunk / this.pdf.uploadProgress.totalChunk) *100)
    }    
  }
}
</script>

<style>

</style>
