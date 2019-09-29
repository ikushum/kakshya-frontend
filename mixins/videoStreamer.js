import io from 'socket.io-client'
export default {
  data () {
    return {
      lifecycle: {
        isClassRequested: false,
        isSocketReady: false,
        isPeerConnectionStarted: false,
      },
      isClassCreator: false,
      localStream: null,
      videoElementId: 'videoElement',
      socket: io.connect('https://192.168.1.70:8080', { secure: true, reconnect: true, rejectUnauthorized : false }),
    }
  },
  methods: {
    createClassRoom () {
      this.lifecycle.isClassRequested = true
      this.socket.emit('create', this.roomName)
      this.listenSocket()
    },
    joinClassRoom () {
      this.lifecycle.isClassRequested = true
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
        this.lifecycle.isClassRequested = false
        console.error('getUserMedia() error: ' + e)
      })
    },
    gotStream(stream) {
      this.localStream = stream
      document.querySelector(`#${this.videoElementId}`).srcObject = stream
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
      } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message)
        alert('Cannot create RTCPeerConnection object.');        
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
        this.getUserMedia()
        this.isClassCreator = true
      })
      this.socket.on('full', (room) => {
        alert('Room ' + room + ' is full')
        this.lifecycle.isClassRequested = false
      })
      this.socket.on('notfound', (room) => {
        alert('Room ' + room + ' not found')
        this.lifecycle.isClassRequested = false
      })
      this.socket.on('join', (room) =>{
        console.log('Another peer made a request to join room ' + room)
        this.lifecycle.isSocketReady = true
      })
      this.socket.on('joined', (room) => {
        console.log('joined: ' + room)
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
    }
  }
}
