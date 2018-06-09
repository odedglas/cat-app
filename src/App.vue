<template>
    <div ref="layout" v-material-layout-load="{drawerStateChangeHandler: setDrawerState}" class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
          <span class="mdl-layout-title">CropChat</span>
        </div>
      </header>
      <!-- Drawer -->
      <div class="mdl-layout__drawer">
        <span class="mdl-layout-title">CropChat</span>
        <nav class="mdl-navigation">
          <router-link class="mdl-button mdl-js-button  mdl-navigation__link" to="/" @click.native="toggleDrawer()">Home</router-link>
          <router-link class="mdl-button mdl-js-button mdl-navigation__link" to="/post" @click.native="toggleDrawer()">Post a picture</router-link>
          <router-link class="mdl-button mdl-js-button mdl-navigation__link" to="/attach-camera-photo" @click.native="toggleDrawer()">Attach a picture</router-link>
        </nav>
      </div>
      <main class="mdl-layout__content">
        <!-- Main content touch -->
        <div class="page-content full-size" @swipe="toggleDrawer()">
          <router-view></router-view>
        </div>
      </main>
    </div>
</template>

<script>
  import firebase from './service/firebase';

  require('material-design-lite');

  export default {
    name: 'app',
    data() {
      return {
        drawerOpen: false,
      };
    },
    provide() {
      const appProvider = {};
      Object.defineProperty(
        appProvider,
        'cats',
        {
          enumerable: true, get: () => this.cat,
        },
      );
      return { appProvider };
    },
    firebase: {
      cat: firebase.database.ref('cats').orderByChild('created_at'),
    },
    methods: {
      toggleDrawer() {
        const layout = this.$refs.layout;
        layout.MaterialLayout.toggleDrawer();
        this.drawerOpen = layout.isDrawerVisible();
      },
      setDrawerState(isOpen) {
        this.drawerOpen = isOpen;
      },
    },
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  @import url('https://code.getmdl.io/1.2.1/material.blue-red.min.css');
  @import '../src/assets/style/index.scss';
</style>
