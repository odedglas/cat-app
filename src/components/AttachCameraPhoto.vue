<template>
  <div class="camera-modal">
    <video ref="video" class="camera-stream"/>
    <div class="camera-modal-container">
        <button v-if="devices.length > 1" @click.prevent="switchCamera" class="siwtch-camera-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab mdl-button--mini-fab">
          <i class="material-icons">switch_camera </i>
        </button>
        <span @click.prevent="capture" class="take-picture-button take-picture-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab mdl-button--colored">
          <i class="material-icons">camera</i>
        </span>
    </div>
  </div>
</template>
<script>
  import firebaseService from '../service/firebase';

  export default {
    name: 'attach-cat-photo',
    data() {
      return {
        mediaStream: null,
        isPosting: false,
        useFrontCamera: false,
        devices: [],
      };
    },
    mounted() {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        this.devices = devices.filter(d => d.kind === 'videoinput');
        const camera = this.devices[0];
        this.loadCamera(camera);
      });
    },
    destroyed() {
      this.cleanCameraResources();
    },
    methods: {
      loadCamera(camera) {
        const constraints = {
          video: {
            deviceId: camera ? { exact: camera.deviceId } : undefined,
          },
        };
        navigator.mediaDevices.getUserMedia(constraints)
          .then((mediaStream) => {
            this.$refs.video.srcObject = mediaStream;
            this.$refs.video.play();
            this.mediaStream = mediaStream;
          })
          .catch(error => console.error('getUserMedia() error:', error));
      },
      switchCamera() {
        const camera = this.devices[this.useFrontCamera ? 0 : 1];
        this.cleanCameraResources();
        this.loadCamera(camera);
        this.useFrontCamera = !this.useFrontCamera;
      },
      cleanCameraResources() {
        if (this.mediaStream !== null) {
          const tracks = this.mediaStream.getTracks();
          tracks.map(track => track.stop());
        }
      },
      capture() {
        const mediaStreamTrack = this.mediaStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(mediaStreamTrack);
        this.$refs.video.pause();
        return imageCapture.takePhoto().then((blob) => {
          this.isPosting = true;
          firebaseService.storage.ref().child(`images/picture-${new Date().getTime()}`).put(blob)
            .then((res) => {
              this.postCat(res.metadata.downloadURLs[0]);
            });
        });
      },
      postCat(url) {
        firebaseService.addNewCat(
          url,
          'Hey Picture',
          'Posted by Charles on Tuesday',
        )
          .then(() => {
            this.$router.push('/');
            this.isPosting = false;
          });
      },
    },
  };
</script>
<style lang="scss" scoped>

  .camera-modal {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-color: white;
    z-index: 10;
  }
  .camera-stream {
    width: 100%;
    max-height: 100%;
  }

  .camera-modal-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    align-items: center;
    margin-bottom: 24px;
  }

  .siwtch-camera-button {
    position: absolute;
    left: 35%;
    top: 50%;
    transform: translate(-100%,-50%);
  }

  .take-picture-button {
    display: flex;
  }

</style>
