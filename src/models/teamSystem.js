import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getPicList, saveAdUrl } from '../services/inviteQRcode';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
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
    *saveAdUrl({ payload }, { call, put }) {
      const response = yield call(saveAdUrl, payload);
      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '保存成功',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `保存失败:${response.message}`,
        });
      }
    },
  },

  reducers: {
    saveAdUrlLocal(state, { payload }) {
      const { teamSystemImageList } = state;
      const { adItem, index } = payload;
      teamSystemImageList[index] = adItem;
      return {
        ...state,
        teamSystemImageList,
      };
    },
  },
});
