import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getNoticeListPage, deleteNotice } from '../services/noticeAdd';
import { getOptionMapList } from '../services/orderManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'noticeList',

  state: {
    levelList: [],
    noticeDetailList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/platformNotice/noticeList') {
          dispatch({
            type: 'getLevelList',
            payload: {
              enumType: 'platformMessageLevel',
              key: 'levelList',
            },
          });

          dispatch({
            type: 'getNoticeListPage',
          });
        }
      });
    },
  },

  effects: {
    *getNoticeListPage(_, { call, put, select }) {
      const { current, pageSize } = yield select(state => state.noticeList);
      const response = yield call(getNoticeListPage, {
        current,
        pageSize,
      });
      if (response.code === 200) {
        yield put({
          type: 'setDatas',
          payload: [
            {
              key: 'noticeDetailList',
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
    *getLevelList({ payload }, { call, put }) {
      const { enumType, key } = payload;
      const response = yield call(getOptionMapList, enumType);
      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key,
            value: response.data,
          },
        });
      }
    },
    *deleteNotice({ payload }, { call, put }) {
      const response = yield call(deleteNotice, {
        msgPlatformMessageId: payload,
      });

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '删除通知成功',
        });

        yield put({
          type: 'getNoticeListPage',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `删除通知失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
