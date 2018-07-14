import modelExtend from 'dva-model-extend';
import { getPicList, saveAdUrl } from '../services/inviteQRcode';
import { getGoodsListPage } from '../services/commodityAdd';
import { getActivityListPage } from '../services/activityManage';

import commonModel from './common';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'indexAd',

  state: {
    picList: [],
    activityList: [],
    commodityList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/adManage/indexAd') {
          dispatch({
            type: 'getPicList',
          });

          dispatch({
            type: 'getActivityList',
          });

          dispatch({
            type: 'getCommodityList',
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
    *getActivityList(_, { call, put }) {
      const response = yield call(getActivityListPage, {
        current: 1,
        pageSize: 999,
      });
      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'activityList',
            value: response.data.list,
          },
        });
      }
    },
    *getCommodityList(_, { call, put }) {
      const response = yield call(getGoodsListPage, {
        pageNum: 1,
        pageSize: 999,
        conditions: {
          isOnSell: true,
        },
      });
      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'commodityList',
            value: response.data.list,
          },
        });
      }
    },
    *saveAdUrl({ payload }, { call, put, select }) {
      const { id } = payload;
      const { picList } = yield select(state => state.indexAd);
      const adItem = picList.filter(x => x.id === id)[0];
      const response = yield call(saveAdUrl, adItem);
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
      const { picList } = state;
      const { adItem, index } = payload;
      picList[index] = adItem;
      return {
        ...state,
        picList,
      };
    },
  },
});
