import {
  regenerator as regeneratorRuntime,
  _wx
} from '../lib/index.js';

import { getAllGameCategory, getRoomDetail, getRoomList } from '../services/index.js';

export default {
  namespace: 'douyu',
  state: {
    roomList: [],
    offset: 0,
    type: 'lol',
    full: false,
    loading: false
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
      history.listen(({ pathname, query, isBack }) => {
        if(isBack) return;

        if (pathname == '/pages/douyu/index'){
          
          dispatch({
            type: 'getRoomList',
            payload: {
              type: query.type,
              offset: 0
            }
          })
        }

        if (pathname == '/pages/douyu/room') {
          dispatch({
            type: 'getRoomDetail',
            payload: query.id
          })
        }
      })
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    *getRoomList({ payload = null }, { call, put, select }) {
      let { type, offset, roomList, full, loading } = yield select((_) => (_.douyu))

      if (full || loading) {
        return
      }; //没有下一页了 or 正在加载

      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      })
      yield _wx.showLoading({ title: '加载中...', mask: true })

      if (payload != null){
        type = payload.type
        offset = payload.offset
        roomList = []
        full = false
      }

      
      let { data } = yield call(getRoomList, type, offset)
      if (data.error == 0 ){
        offset++;
        if (data.data.length < 30){
          full = true;
        }
        
        yield put({
          type: 'save',
          payload: {
            roomList: [...roomList ,...data.data],
            offset,
            type,
            full
          }
        })
      }

      yield put({
        type: 'save',
        payload: {
          loading: false
        }
      })

      yield _wx.hideLoading()
    },

    *getAllGameCategory({ payload }, { call, put, select }) {
      
    },

    *getRoomDetail({ payload }, { call, put, select }) {
      yield _wx.showLoading({ title: '加载中...', mask: true })
      let { data } = yield call(getRoomDetail, payload)
      if (data.error == 0) {
        yield put({
          type: 'save',
          payload: {
            roomDetail: data.data
          }
        })
      }

      yield _wx.hideLoading()
    },

  }
}