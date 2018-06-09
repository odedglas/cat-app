<template>
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--8-col">
      <div class="picture">
        <img :src="selectedCat.url" />
      </div>
      <div class="info">
        <span>{{ selectedCat.info }}</span>
      </div>
    </div>
    <div class="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
      <div class="comment">
        <span>{{ selectedCat.comment }}</span>
      </div>
      <div class="actions">
        <router-link class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" to="/post">
          ANSWER
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'cat-details',
    inject: ['appProvider'],
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    computed: {
      cats() {
        return this.appProvider.cats;
      },
      selectedCat() {
        return this.cats.length > 0 ? this.cats.find(c => c['.key'] === this.id) : {};
      },
    },
  };

</script>
<style scoped>
  .picture > img {
    color: #fff;
    width:100%;
  }
  .info {
    text-align: right;
    padding: 5px;
    color: #555;
    font-size: 10px;
  }
  .comment {
    padding: 10px;
    color: #555;
  }
  .actions {
    text-align: center;
  }
</style>
