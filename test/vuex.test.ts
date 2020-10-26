
import Vuex from '../ts/vuex'

const ADD = 'ADD';
const CHAT = 'CHAT';

type AddType = typeof ADD;
type ChatType = typeof CHAT;

type ActionTypes =
  | {
      type: AddType;
      payload: number;
    }
  | {
      type: ChatType;
      payload: string;
  };
    
export type PickPayload<Types, Type> = Types extends {
  type: Type;
  payload: infer P;
}
  ? P
  : never;

type PickStorePayload<T> = PickPayload<ActionTypes, T>;

const store = new Vuex({
  state: {
    count: 0,
    message: '',
  },
  action: {
    async [ADD](state, payload: PickStorePayload<AddType>) {
      state.count += payload;
    },
    async [CHAT](state, message: PickStorePayload<ChatType>) {
      state.message = message;
    },
  },
  getters: {
    countGetter(state) {
      return state.count + 1
    },
    messageGetter(state) {
      return `Hey! ${state.message}`
    },
  },
});

store.subscribeAction({
  before: (action, state, getters) => {
    console.log(
      `before action ${action.type}, before state is ${JSON.stringify(
        state,
      )}, before getter is ${JSON.stringify(getters)}`,
    );
  },
  after: (action, state, getters) => {
    console.log(
      `after action ${action.type},  after state is ${JSON.stringify(
        state,
      )}, after getter is ${JSON.stringify(getters)}`,
    );
  },
});

// for TypeScript support
const dispatch = store.createDispatch<ActionTypes>();

dispatch({
  type: ADD,
  payload: 3,
});

dispatch({
  type: CHAT,
  payload: 'Hello World',
});