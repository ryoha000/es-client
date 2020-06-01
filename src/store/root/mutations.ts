import { MutationTree } from 'vuex';
import { RootStateInterface } from './state';
import { StackType } from 'src/types/root';

const mutation: MutationTree<RootStateInterface> = {
  someMutation (/* state: RootStateInterface */) {
    // your code
  },
  addStack(state: RootStateInterface, stack: StackType) {
    state.routeStack.push(stack)
  }
};

export default mutation;
