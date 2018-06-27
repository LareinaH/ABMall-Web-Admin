import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getKeyValues, saveKeyPairs } from '../services/messageTemplate';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'messageTemplate',

  state: {
    keyPairs: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/messageTemplate') {
          dispatch({
            type: 'getKeyValues',
          });
        }
      });
    },
  },

  effects: {
    *getKeyValues(_, { call, put }) {
      const response = yield call(getKeyValues);
      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'keyPairs',
            value: response.data,
          },
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `读取配置值失败:${response.message}`,
        });
      }
    },
    *saveKeyPairs({ payload }, { call, put, select }) {
      const {
        PROMOTION_AWARD_1,
        PROMOTION_AWARD_2,
        SHARE_AWARD_1,
        SHARE_AWARD_2,
        EXECUTIVE_AWARD,
      } = payload;
      const { keyPairs } = yield select(state => state.messageTemplate);

      console.log(keyPairs);

      Object.keys(keyPairs).forEach(key => {
        if (keyPairs[key].item === 'PROMOTION_AWARD_1') {
          keyPairs[key].value = PROMOTION_AWARD_1;
        }

        if (keyPairs[key].item === 'PROMOTION_AWARD_2') {
          keyPairs[key].value = PROMOTION_AWARD_2;
        }

        if (keyPairs[key].item === 'SHARE_AWARD_1') {
          keyPairs[key].value = SHARE_AWARD_1;
        }

        if (keyPairs[key].item === 'SHARE_AWARD_2') {
          keyPairs[key].value = SHARE_AWARD_2;
        }

        if (keyPairs[key].item === 'EXECUTIVE_AWARD') {
          keyPairs[key].value = EXECUTIVE_AWARD;
        }
      });

      const dataList = [];
      Object.keys(keyPairs).forEach(key => {
        dataList.push(keyPairs[key]);
      });

      console.log(dataList);

      const response = yield call(saveKeyPairs, {
        namespace: 'xxx',
        dataList,
      });
      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: `保存消息模板配置成功`,
        });
        yield put({
          type: 'getKeyValues',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `读取配置值失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
