import modelExtend from 'dva-model-extend';
import picModel from './inviteQRcode';
import { getPicList } from '../services/inviteQRcode';

export default modelExtend(picModel, {
  namespace: 'indexAd',

  state: {
    picList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/adManage/indexAd') {
          dispatch({
            type: 'getPicList',
          });
        }
      });
    },
  },

  effects: {
    *getPicList(_, { call, put }) {
      const response = yield call(getPicList, { adType: 'BANNER' });
      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'picList',
            value: response.data,
          },
        });
      }
    },
  },

  reducers: {},
});
