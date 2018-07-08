import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getActivityListPage, deleteActivity } from '../services/activityManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'activityList',

  state: {
    levelList: [],
    activityDetailList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/activityManage/activityList') {
          dispatch({
            type: 'getActivityListPage',
          });
        }
      });
    },
  },

  effects: {
    *getActivityListPage(_, { call, put, select }) {
      const { current, pageSize } = yield select(state => state.activityList);
      const response = yield call(getActivityListPage, {
        current,
        pageSize,
      });
      if (response.code === 200) {
        yield put({
          type: 'setDatas',
          payload: [
            {
              key: 'activityDetailList',
              value: response.data.list,
            },
            {
              key: 'total',
              value: response.data.total,
            },
          ],
        });
      }
    },
    *deleteActivity({ payload }, { call, put }) {
      const response = yield call(deleteActivity, {
        shopActivitiesId: payload,
      });

      if (response.code === 200) {
        yield put({
          type: 'showActivity',
          payload: '删除活动成功',
        });

        yield put({
          type: 'getActivityListPage',
        });
      } else {
        yield put({
          type: 'showActivity',
          payload: `删除活动失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
