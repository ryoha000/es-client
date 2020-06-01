import axios, { AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default boot(({ Vue }: any) => {
  Vue.prototype.$axios = axios;
});
