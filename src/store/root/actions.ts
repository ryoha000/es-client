import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { RootStateInterface } from './state';

const actions: ActionTree<RootStateInterface, StoreInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default actions;
