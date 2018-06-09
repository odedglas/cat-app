import MaterialLayoutLoad from './material-layout-load';

const register = (Vue, directive) => Vue.directive(directive.name, directive);
export default {
  install(Vue) {
    register(
      Vue,
      MaterialLayoutLoad,
    );
  },
};
