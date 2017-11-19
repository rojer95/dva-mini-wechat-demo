import {
  regenerator as regeneratorRuntime
} from '../lib/index.js';

export default {
  namespace: 'index',
  state: {
    count: 0,
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, count: payload };
    },
  },

  effects: {
    *adjust({ payload }, { call, put, select }) {
      let count = yield select((_)=>_.index.count)
      count += payload;
      yield put({
        type: 'save',
        payload: count
      })
    }

  }
}