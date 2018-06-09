/* eslint-disable no-param-reassign */

export default {
  name: 'material-layout-load',
  bind(el, binding) {
    const hooks = binding.value;
    let hooked = false;
    el.addEventListener('mdl-componentupgraded', () => {
      if (!hooked && el.MaterialLayout) {
        /* Hooking drawer events */
        el.MaterialLayout.header_.querySelector('div[role="button"').addEventListener('click', () => hooks.drawerStateChangeHandler(true));
        /* Extending Layout */
        el.isDrawerVisible = () => el.MaterialLayout.drawer_.classList.contains('is-visible');
        hooked = true;
      }
    });
  },
  update() {
    setTimeout(() => window.componentHandler.upgradeDom(), 50);
  },
  unbind() {
  },
};
