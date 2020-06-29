/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import VueCompositionApi from '@vue/composition-api';
import { boot } from 'quasar/wrappers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default boot(({ Vue }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Vue.use(VueCompositionApi);
});
