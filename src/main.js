// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueTouch from 'vue-touch';
import Vuefire from 'vuefire';
import App from './App';
import router from './router';
import directives from './directive';

require('image-capture');

Vue.config.productionTip = false;

/* Plugins */
Vue.use(VueTouch);
Vue.use(Vuefire);

/* Directives */
directives.install(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
