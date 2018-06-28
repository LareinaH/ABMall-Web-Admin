import modelExtend from 'dva-model-extend';
import picModel from './inviteQRcode';
import { getPicList } from '../services/inviteQRcode';

export default modelExtend(picModel, {
  namespace: 'teamSystem',

  state: {
    teamSystemImageList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/adManage/teamSystem') {
          dispatch({
            type: 'getTeamSystemImageList',
          });
        }
      });
    },
  },

  effects: {
    *getTeamSystemImageList(_, { call, put }) {
      const response = yield call(getPicList, { adType: 'TEAM_SYSTEM' });
      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'teamSystemImageList',
            value: response.data,
          },
        });
      }
    },
  },

  reducers: {},
});
