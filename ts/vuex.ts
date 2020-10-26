export type Actions<S, A> = {
  [K in keyof A]: (state: S, payload: any) => Promise<any>;
};

export type ActionArguments<A> = {
  type: keyof A;
  payload?: any;
};

export type Subscriber<S, A, G> = (action: ActionArguments<A>, state: S, getters: G) => any;

export type ActionSubscriber<S, A, G> = {
  before: Subscriber<S, A, G>;
  after: Subscriber<S, A, G>;
};

export type ActionSubscribers<S, A, G> = ActionSubscriber<S, A, G>[];

export interface Dispatch<A> {
  (action: A, ...extraArgs: any[]): any;
}

export type Getters<S, G> = {
  [K in keyof G]: (state: S) => G[K];
};

export default class Vuex<S, A, G> {
  state: S;
  action: Actions<S, A>;
  // getters的计算规则
  rawGetters: Getters<S, G>;
  // 计算出的getters
  getters: G;
  _actionSubscribers: ActionSubscribers<S, A, G>;

  constructor({
    state,
    action,
    getters: rawGetters,
  }: {
    state: S;
    action: Actions<S, A>;
    getters: Getters<S, G>;
  }) {
    this.state = state;
    this.action = action;
    this._actionSubscribers = [];
    this.rawGetters = rawGetters;
    this.getters = {} as G;
    this.calcGetters();
  }

  dispatch(action: ActionArguments<A>) {
    this._actionSubscribers.forEach(sub => sub.before(action, this.state, this.getters));

    const { type, payload } = action;
    this.action[type](this.state, payload).then(() => {
      this._actionSubscribers.forEach(sub => sub.after(action, this.state, this.getters));
      // 计算一把getters
      this.calcGetters();
    });
  }

  subscribeAction(subscriber: ActionSubscriber<S, A, G>) {
    this._actionSubscribers.push(subscriber);
  }

  calcGetters() {
    const { rawGetters } = this;
    Object.keys(this.rawGetters).forEach(rawGetterKey => {
      const rawGetter = rawGetters[rawGetterKey];
      this.getters[rawGetterKey] = rawGetter(this.state);
    });
  }

  createDispatch<A>() {
    return this.dispatch.bind(this) as Dispatch<A>;
  }
}