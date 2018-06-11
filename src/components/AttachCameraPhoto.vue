<template>
  <div class="camera-modal">
    <div aria-live="assertive" aria-atomic="true" aria-relevant="text" class="mdl-snackbar mdl-js-snackbar">
      <div class="mdl-snackbar__text">
      </div>
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded is-dirty">
        <input id="username" ref="camera-comment" v-model="comment" type="text" autocomplete="off" class="mdl-textfield__input"/>
        <label for="username" class="mdl-textfield__label">Describe me</label>
      </div>
      <button type="button" class="mdl-snackbar__action"> T</button>
      <button type="button" class="_action" @click.prevent="cancelCapture"> CANCEL </button>
      <button type="button" class="_action" @click.prevent="doUpload"> UPLOAD </button>
    </div>
    <div class="camera-stream" :class="isPosting ? 'loading' : ''">
      <video ref="video" class="video" />
      <div v-show="isPosting" class="image-loader mdl-spinner mdl-js-spinner is-active"></div>
    </div>
    <div class="camera-modal-container">
        <button v-if="devices.length > 0"
                @click.prevent="switchCamera"
                :disabled="lockButtons"
                class="siwtch-camera-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab mdl-button--mini-fab">
          <i class="material-icons">switch_camera </i>
        </button>
        <span @click.prevent="capture"
              :disabled="lockButtons"
              class="take-picture-button take-picture-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab mdl-button--colored">
          <i class="material-icons">camera</i>
        </span>
    </div>
  </div>
</template>
<script>
  import firebaseService from '../service/firebase';
  import imageCaptureService from '../service/imageCapture';

  export default {
    name: 'attach-cat-photo',
    data() {
      return {
        mediaStream: null,
        isPosting: false,
        useFrontCamera: false,
        snackbarAlive: false,
        devices: [],
        url: undefined,
        comment: undefined,
        currentBlob: undefined,
      };
    },
    computed: {
      lockButtons() {
        return this.isPosting || this.snackbarAlive;
      },
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
      showCommentBar() {
        const notification = document.querySelector('.mdl-js-snackbar');
        const data = {
          message: '',
          timeout: 30000,
        };
        notification.MaterialSnackbar.showSnackbar(data);
        const actions = document.querySelectorAll('.mdl-snackbar__action');
        actions.forEach(a => a.removeAttribute('aria-hidden'));
        this.$refs['camera-comment'].focus();
        this.snackbarAlive = true;
      },
      clearCommentSnackbar() {
        const notification = document.querySelector('.mdl-js-snackbar');
        notification.MaterialSnackbar.cleanup_();
        this.snackbarAlive = false;
      },
      cleanCameraResources() {
        if (this.mediaStream !== null) {
          this.currentBlob = undefined;
          const tracks = this.mediaStream.getTracks();
          tracks.map(track => track.stop());
        }
      },
      capture() {
        const mediaStreamTrack = this.mediaStream.getVideoTracks()[0];
        const imageCapture = imageCaptureService.create(mediaStreamTrack);
        this.$refs.video.pause();
        return imageCapture.takePhoto().then((blob) => {
          this.currentBlob = blob;
          this.showCommentBar();
        });
      },
      cancelCapture() {
        this.clearCommentSnackbar();
        this.$refs.video.play();
      },
      doUpload() {
        this.isPosting = true;
        if (this.comment) {
          this.clearCommentSnackbar();
          firebaseService.storage.ref().child(`images/picture-${new Date().getTime()}`).put(this.currentBlob)
            .then((res) => {
              this.url = res.metadata.downloadURLs[0];
              firebaseService.addNewCat(
                this.url,
                this.comment,
                'Posted by Charles',
              )
                .then(() => {
                  this.$router.push('/');
                  this.isPosting = false;
                });
            });
        } else {
          this.$refs['camera-comment'].focus();
          this.isPosting = false;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>

  $snackbar-action-color:rgb(255,82,82);

  .camera-modal {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-color: white;
    z-index: 10;

    .camera-stream {
      width: 100%;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.loading {
        opacity:0.8;
      }

      .video {
        width: 100%;
        max-height: 100%;
      }
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

    .image-loader {
      position: absolute;
    }
  }

  .mdl-snackbar {
    .mdl-textfield {
      color:white;

      .mdl-textfield__label {
        color:$snackbar-action-color;
        font-size:14px;
        &::after {
          background-color: $snackbar-action-color;
        }
      }
    }

    .mdl-snackbar__action {
      display:none;
      opacity: 1;
    }

    ._action {
      background: 0 0;
      border: none;
      color: rgb(255,82,82);
      float: right;
      padding: 14px 24px 14px 12px;
      font-family: "Roboto","Helvetica","Arial",sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      line-height: 1;
      letter-spacing: 0;
      overflow: hidden;
      outline: none;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;

      &:last-child {
        margin-right:15px;
      }
    }
  }

</style>
