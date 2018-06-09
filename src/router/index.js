import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import PostCat from '@/components/PostCat';
import AttachCameraPhoto from '@/components/AttachCameraPhoto';
import CatDetails from '@/components/CatDetails';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/details/:id',
      name: 'details',
      props: true,
      component: CatDetails,
    },
    {
      path: '/post',
      name: 'post',
      component: PostCat,
    },
    {
      path: '/attach-camera-photo',
      name: 'attach-camera-photo',
      component: AttachCameraPhoto,
    },
  ],
});
