import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getUserStat } from '../services/stat';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'userStat',

  state: {
    statInfo: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/reportStat/userStat') {
          dispatch({
            type: 'getUserStat',
          });
        }
      });
    },
  },

  effects: {
    *getUserStat(_, { call, put }) {
      const response = yield call(getUserStat);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            statInfo: response.data,
          },
        });
      }
    },
  },

  reducers: {},
});
