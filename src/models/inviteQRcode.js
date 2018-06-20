import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getPicList, saveAdUrl } from '../services/inviteQRcode';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'inviteQRcode',

  state: {
    invitingCodeList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/inviteQRcode') {
          dispatch({
            type: 'getInviteQRCodeList',
          });
        }
      });
    },
  },

  effects: {
    *getInviteQRCodeList(_, { call, put }) {
      const response = yield call(getPicList, { adType: 'INVITING_CODE_BACKGROUND' });
      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'invitingCodeList',
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

      // yield put({
      //   type: 'getInviteQRCodeList',
      // });
    },
  },

  reducers: {
    saveAdUrlLocal(state, { payload }) {
      const { invitingCodeList } = state;
      const { adItem, index } = payload;
      invitingCodeList[index] = adItem;
      return {
        ...state,
        invitingCodeList,
      };
    },
  },
});
