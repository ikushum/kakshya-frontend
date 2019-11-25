import io from 'socket.io-client'
export default {
  data () {
    return {
      lifecycle: {
        isClassAvailable: false,
        isSocketReady: false,
        isPeerConnectionStarted: false,
        videoAvailable: false,
      },
      peerConnection: null,
      dataChannel: null,
      recievingFile: [],
      isClassCreator: false,
      localStream: null,
      videoElementId: 'videoElement',
      socket: io.connect('https://192.168.1.70:8080', { secure: true, reconnect: true, rejectUnauthorized : false }),
    }
  },
  methods: {
    createClassRoom () {
      this.socket.emit('create', this.roomName)
      this.listenSocket()
    },
    joinClassRoom () {
      this.socket.emit('join', this.roomName)
      this.listenSocket()
    },
    getUserMedia () {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      })
      .then(this.gotStream)
      .catch((e) => {
        this.lifecycle.isClassAvailable = false
        console.error('getUserMedia() error: ' + e)
      })
    },
    gotStream(stream) {
      this.localStream = stream
      document.querySelector(`#${this.videoElementId}`).srcObject = stream
      this.lifecycle.videoAvailable = true
      this.sendMessage('got user media')
      if (this.isClassCreator) {
        this.maybeStart()
      }
    },
    sendMessage(message) {
      this.socket.emit('message', message)
    },
    maybeStart() {
      if (!this.lifecycle.isPeerConnectionStarted && typeof this.localStream !== 'undefined' && this.lifecycle.isSocketReady) {
        this.createPeerConnection()
        this.lifecycle.isPeerConnectionStarted = true
        if (this.isClassCreator) {
          this.peerConnection.addStream(this.localStream)
          this.doCall()
        }
      }
    },
    createPeerConnection() {
      try {
        this.peerConnection = new RTCPeerConnection(null)
        this.peerConnection.onicecandidate = this.handleIceCandidate
        this.peerConnection.onaddstream = this.handleRemoteStreamAdded
        this.peerConnection.onremovestream = this.handleRemoteStreamRemoved
        this.dataChannel = this.peerConnection.createDataChannel('sendDataChannel', {negotiated: true, id: 0})
        this.listenDataChannel()  
        this.checkIfPdfexists()     
        // this.sharePdfToClass() 
      } catch (e) {
        console.log(e)
        this.snackbar = {
          display: true,
          text: 'Cannot create RTCPeerConnection object.',
          color: 'error'
        }
        return
      }
    },
    handleIceCandidate(event) {
      if (event.candidate) {
        this.sendMessage({
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        })
      }
    },
    handleCreateOfferError(event) {
      console.error('createOffer() error: ', event)
    },
    doCall() {
      this.peerConnection.createOffer(this.setLocalAndSendMessage, this.handleCreateOfferError)
    },
    doAnswer() {
      this.peerConnection.createAnswer().then(
        this.setLocalAndSendMessage,
        this.onCreateSessionDescriptionError
      )
    },
    setLocalAndSendMessage(sessionDescription) {
      this.peerConnection.setLocalDescription(sessionDescription)
      this.sendMessage(sessionDescription)
    },
    onCreateSessionDescriptionError(error) {
      console.error('Failed to create session description: ' + error.toString())
    },
    handleRemoteStreamAdded(event) {
      this.remoteStream = event.stream
      this.lifecycle.videoAvailable = true
      document.querySelector(`#${this.videoElementId}`).srcObject = event.stream
    },
    handleRemoteStreamRemoved(event) {
      console.log('Remote stream removed. Event: ', event)
    },
    hangup() {
      this.stop()
      this.sendMessage('bye')
    },
    handleRemoteHangup() {
      this.stop()
      this.isClassCreator = false
    },
    stop() {
      this.lifecycle.isPeerConnectionStarted = false
      this.peerConnection.close()
      this.peerConnection = null
    },
    listenSocket () {
      this.socket.on('created', (room) => {
        this.snackbar = {
          display: true,
          text: 'Room ' + room + ' created',
          color: 'success'
        }
        this.lifecycle.isClassAvailable = true
        this.getUserMedia()
        this.isClassCreator = true
      })
      this.socket.on('full', () => {
        this.$router.push({
          name: 'index',
          query: {
            metaRoom: this.roomName,
            metaMsg: 'full'
          }
        })
      })
      this.socket.on('notfound', () => {
        this.$router.push({
          name: 'index',
          query: {
            metaRoom: this.roomName,
            metaMsg: 'notFound'
          }
        })
      })
      this.socket.on('join', (room) =>{
        this.snackbar = {
          display: true,
          text: 'Another peer made a request to join room' + room,
          color: 'info'
        }              
        this.lifecycle.isSocketReady = true
      })
      this.socket.on('joined', (room) => {
        this.snackbar = {
          display: true,
          text: 'Room ' + room + ' joined',
          color: 'success'
        }
        this.lifecycle.isClassAvailable = true
        this.sendMessage('got user media')
        this.lifecycle.isSocketReady = true
      })
      this.socket.on('message', (message) => {
        if (message === 'got user media') {
          this.maybeStart()
        } else if (message.type === 'offer') {
          if (!this.isClassCreator && !this.lifecycle.isPeerConnectionStarted) {
            this.maybeStart()
          }
          this.peerConnection.setRemoteDescription(new RTCSessionDescription(message))
          this.doAnswer()
        } else if (message.type === 'answer' && this.lifecycle.isPeerConnectionStarted) {
          this.peerConnection.setRemoteDescription(new RTCSessionDescription(message))
        } else if (message.type === 'candidate' && this.lifecycle.isPeerConnectionStarted) {
          var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
          })
          this.peerConnection.addIceCandidate(candidate)
        } else if (message === 'bye' && this.lifecycle.isPeerConnectionStarted) {
          this.handleRemoteHangup()
        }
      })
    },
    resetStream () {
      alert('Comming Soon')
    },
    listenDataChannel () {
      this.dataChannel.onmessage = () => {
        let data = JSON.parse(event.data);
        if (data.textMessage) {
          this.messages.push(data.textMessage)
          setTimeout(() => {document.getElementById("chatBox").scrollIntoView({ block: 'end',  behavior: 'smooth' }) }, 100)
          return
        }
        this.pdf.uploadProgress.sharing = true
        this.pdf.uploadProgress.totalChunk = data.totalChunk
        this.pdf.uploadProgress.remainingChunk = data.remainingChunk
        this.recievingFile.push(data.message); // pushing chunks in array
        if (data.last) {
            this.snackbar = {
              display: true,
              text: 'The room creator just uploaded a PDF',
              color: 'info'
            }
            this.pdf.uploadProgress.sharing = false
            let dataUrl = this.recievingFile.join('')
            const blob = dataURItoBlob(dataUrl)
            this.createFileUrl(blob)
            this.recievingFile = []
        }
      }
    },
    checkIfPdfexists () {
      if (!this.pdf.file) return 
      this.dataChannel.onopen = () => {
        this.convertAndSend()
      }
    },
    sharePdfToClass () {
      if (!this.peerConnection) return
      this.convertAndSend()
    },
    convertAndSend () {
      var reader = new window.FileReader()
      reader.readAsDataURL(this.pdf.file)
      reader.onload = this.sendDataAsUrl
    },
    sendDataAsUrl (event, text) {
      var chunkLength = 1000
      var data = {} // data object to transmit over data channel
      if (event) { // on first invocation
        text = event.target.result
        this.pdf.uploadProgress.totalChunk = text.length
      }
      if (text.length > chunkLength) {
          data.message = text.slice(0, chunkLength) // getting chunk using predefined chunk length
      } else {
          data.message = text
          data.last = true
      }
      data.totalChunk = this.pdf.uploadProgress.totalChunk
      data.remainingChunk = this.pdf.uploadProgress.remainingChunk
      this.dataChannel.send(JSON.stringify(data)) // use JSON.stringify for chrome!
      var remainingDataURL = text.slice(data.message.length)
      this.pdf.uploadProgress.remainingChunk = remainingDataURL.length
      if (remainingDataURL.length) setTimeout(() => {
          this.sendDataAsUrl(null, remainingDataURL) // continue transmitting
      }, 500)
    },
    sendTextMessage (message) {
      if (!message) return
      let data = {isCreator: this.isClassCreator, text: message}
      this.messages.push(data)
      setTimeout(() => {document.getElementById("chatBox").scrollIntoView({ block: 'end',  behavior: 'smooth' }) }, 100)    
      if (!this.peerConnection) return
      this.dataChannel.send(JSON.stringify({ textMessage: data}))
    }
  }
}
let dataURItoBlob = function(dataURI, dataTYPE) {
  var binary = atob(dataURI.split(',')[1]), array = [];
  for(var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
  return new Blob([new Uint8Array(array)], {type: dataTYPE});
}