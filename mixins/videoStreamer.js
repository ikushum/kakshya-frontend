import io from 'socket.io-client'
export default {
  data () {
    return {
      isChannelReady: false,
      isInitiator: false,
      isStarted: false,
      localStream: null,
      pc: null,
      socket: io.connect('https://192.168.1.70:8080', { secure: true, reconnect: true, rejectUnauthorized : false }),
      initialized: false,
      videoElementId: 'videoElement'
    }
  },
  methods: {
    // todo seperate unnecessary methods from here
    initializeClass () {
      this.initialized = true
      this.socket.emit('create', this.roomName)
      this.listenSocket()
    },
    joinClass () {
      this.initialized = true
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
        this.initialized = false
        console.error('getUserMedia() error: ' + e)
      })
    },
    gotStream(stream) {
      console.log('Adding local stream.')
      this.localStream = stream
      document.querySelector(`#videoElement`).srcObject = stream
      this.sendMessage('got user media')
      if (this.isInitiator) {
        this.maybeStart()
      }
    },
    sendMessage(message) {
      console.log('Client sending message: ', message)
      this.socket.emit('message', message)
    },
    maybeStart() {
      if (!this.isStarted && typeof this.localStream !== 'undefined' && this.isChannelReady) {
        console.log('>>>>>> creating peer connection');        
        this.createPeerConnection()
        this.isStarted = true
        console.log('isInitiator', this.isInitiator)
        if (this.isInitiator) {
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
      console.log('icecandidate event: ', event);
      if (event.candidate) {
        this.sendMessage({
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        })
      } else {
        console.log('End of candidates.')
      }
    },
    handleCreateOfferError(event) {
      console.log('createOffer() error: ', event)
    },
    doCall() {
      console.log('Sending offer to peer')
      this.peerConnection.createOffer(this.setLocalAndSendMessage, this.handleCreateOfferError)
    },
    doAnswer() {
      console.log('Sending answer to peer.')
      this.peerConnection.createAnswer().then(
        this.setLocalAndSendMessage,
        this.onCreateSessionDescriptionError
      )
    },
    setLocalAndSendMessage(sessionDescription) {
      this.peerConnection.setLocalDescription(sessionDescription)
      console.log('setLocalAndSendMessage sending message', sessionDescription)
      this.sendMessage(sessionDescription)
    },
    onCreateSessionDescriptionError(error) {
      console.error('Failed to create session description: ' + error.toString())
    },
    handleRemoteStreamAdded(event) {
      console.log('Remote stream added.')
      this.remoteStream = event.stream
      document.querySelector(`#remoteVideo`).srcObject = event.stream
    },
    handleRemoteStreamRemoved(event) {
      console.log('Remote stream removed. Event: ', event)
    },
    hangup() {
      console.log('Hanging up.')
      this.stop()
      this.sendMessage('bye')
    },
    handleRemoteHangup() {
      console.log('Session terminated.')
      this.stop()
      this.isInitiator = false
    },
    stop() {
      this.isStarted = false
      this.peerConnection.close()
      this.peerConnection = null
    },
    listenSocket () {
      this.socket.on('created', (room) => {
        console.log('Created room ' + room)
        this.getUserMedia()
        this.isInitiator = true
      })
      this.socket.on('full', (room) => {
        alert('Room ' + room + ' is full')
        this.initialized = false
      })
      this.socket.on('notfound', (room) => {
        alert('Room ' + room + ' not found')
        this.initialized = false
      })
      this.socket.on('join', (room) =>{
        console.log('Another peer made a request to join room ' + room)
        console.log('This peer is the initiator of room ' + room + '!')
        this.isChannelReady = true
      })
      this.socket.on('joined', (room) => {
        console.log('joined: ' + room)
        this.sendMessage('got user media')
        this.isChannelReady = true
      })
      this.socket.on('log', (array) => {
        console.log.apply(console, array)
      })
      this.socket.on('message', (message) => {
        console.log('Client received message:', message)
        if (message === 'got user media') {
          this.maybeStart()
        } else if (message.type === 'offer') {
          if (!this.isInitiator && !this.isStarted) {
            this.maybeStart()
          }
          this.peerConnection.setRemoteDescription(new RTCSessionDescription(message))
          this.doAnswer()
        } else if (message.type === 'answer' && this.isStarted) {
          this.peerConnection.setRemoteDescription(new RTCSessionDescription(message))
        } else if (message.type === 'candidate' && this.isStarted) {
          var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
          })
          this.peerConnection.addIceCandidate(candidate)
        } else if (message === 'bye' && this.isStarted) {
          this.handleRemoteHangup()
        }
      })
    }
  }
}
