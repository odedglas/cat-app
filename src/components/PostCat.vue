<template>
  <div class="mdl-grid">
    <div class="mdl-cell loading-img-container mdl-cell--8-col">
      <div class="card-image__picture">
        <img ref="randomCatImage" v-show="!sourceLoading" :src="photoURL"/>
        <div v-show="sourceLoading" class="mdl-spinner mdl-js-spinner is-active"></div>
      </div>
    </div>
    <div class="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded is-dirty">
        <input id="username" v-model="title" type="text" autocomplete="off" class="mdl-textfield__input"/>
        <label for="username" class="mdl-textfield__label">Describe me</label>
      </div>
      <div class="actions">
        <button @click.prevent="fetchRandomCat" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" :disabled="sourceLoading">
          CHOOSE ANOTHER
        </button>
        <button @click.prevent="postCat" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" :disabled="!canPost">
          POST A CAT
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import catsService from '../service/cats';
  import firebaseService from '../service/firebase';

  export default {
    name: 'post-cat-photo',
    created() {
      this.fetchRandomCat();
    },
    data() {
      return {
        photoURL: undefined,
        title: '',
        isPosting: false,
        sourceLoading: false,
      };
    },
    firebase: {
      cat: firebaseService.database.ref('cat').orderByChild('created_at'),
    },
    computed: {
      canPost() {
        return !this.sourceLoading && this.photoURL && this.title.length >= 3;
      },
    },
    mounted() {
      this.$refs.randomCatImage.addEventListener('load', () => {
        this.sourceLoading = false;
      });
    },
    methods: {
      fetchRandomCat() {
        this.photoURL = undefined;
        this.sourceLoading = true;
        catsService.getRandomCat().then((catURL) => {
          this.photoURL = catURL;
        });
      },
      postCat() {
        this.isPosting = true;
        firebaseService.addNewCat(
          this.photoURL,
          this.title,
          'Posted by Charles',
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

  .loading-img-container {
    min-height: 300px;
  }

  .card-image__picture {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height:100%;
      width:100%;
    }
  }
</style>
