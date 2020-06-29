/* eslint-disable @typescript-eslint/no-unsafe-call */
import { store } from 'quasar/wrappers';
import Vuex from 'vuex';
import root from './root'
import { RootStateInterface } from './root/state'

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StoreInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  example: unknown;
  root: RootStateInterface
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default store(function ({ Vue }: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.use(Vuex);

  const Store = new Vuex.Store<StoreInterface>({
    modules: {
      //example
      root
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  });

  return Store;
});
