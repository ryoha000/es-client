import VueCompositionApi from '@vue/composition-api';
import { boot } from 'quasar/wrappers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default boot(({ Vue }: any) => {
  Vue.use(VueCompositionApi);
});
