/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import VueCompositionApi from '@vue/composition-api';
import { boot } from 'quasar/wrappers';
import Vue1 from 'vue'
import store from '../store'
import App from '../App.vue'
import PortalVue from 'portal-vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default boot(({ Vue }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Vue.use(VueCompositionApi);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Vue.use(PortalVue)
  new Vue1({
    store: store.original,
    render: h => h(App)
  }).$mount('#q-app')
});
