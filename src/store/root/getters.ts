import { GetterTree } from 'vuex';
import { StoreInterface } from '../index';
import { RootStateInterface } from './state';

const getters: GetterTree<RootStateInterface, StoreInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default getters;
