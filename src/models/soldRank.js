import modelExtend from 'dva-model-extend';
import moment from 'moment';
import commonModel from './common';
import { getOrdersRanklList } from '../services/stat';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'soldRank',

  state: {
    // 2个筛选条件
    gmtStart: moment().startOf('month'),
    gmtEnd: moment().endOf('month'),
    order: undefined,
    columnKey: undefined,

    // 表格数据
    soldRankDetailList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/reportStat/soldRank') {
          // 初始化数据
          dispatch({
            type: 'save',
            payload: {
              gmtStart: moment().startOf('month'),
              gmtEnd: moment().endOf('month'),
              order: undefined,
              columnKey: undefined,
              current: 1,
              pageSize: 10,
            },
          });

          dispatch({
            type: 'getSoldRankDetailList',
          });
        }
      });
    },
  },

  effects: {
    *getSoldRankDetailList(_, { call, put, select }) {
      const { current, pageSize, gmtStart, gmtEnd, order, columnKey } = yield select(
        state => state.soldRank
      );
      const response = yield call(getOrdersRanklList, {
        current,
        pageSize,
        gmtStart: gmtStart.format('YYYY-MM-DD'),
        gmtEnd: gmtEnd.format('YYYY-MM-DD'),
        order,
        columnKey,
      });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            soldRankDetailList: response.data.list,
            total: response.data.total,
          },
        });
      }
    },
  },

  reducers: {},
});
