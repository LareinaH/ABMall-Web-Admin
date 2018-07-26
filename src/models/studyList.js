import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getStudyListPage, updateStatus } from '../services/studyAdd';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'studyList',

  state: {
    studyDetailList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/contentStudy/studyList') {
          dispatch({
            type: 'getStudyListPage',
          });
        }
      });
    },
  },

  effects: {
    *getStudyListPage(_, { call, put, select }) {
      const { current, pageSize } = yield select(state => state.studyList);
      const response = yield call(getStudyListPage, {
        current,
        pageSize,
      });
      if (response.code === 200) {
        yield put({
          type: 'setDatas',
          payload: [
            {
              key: 'studyDetailList',
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
    *updateStatus({ payload }, { call, put }) {
      const response = yield call(updateStatus, payload);

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '更新成功',
        });

        yield put({
          type: 'getStudyListPage',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `更新失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
