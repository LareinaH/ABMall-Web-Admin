import modelExtend from 'dva-model-extend';
import moment from 'moment';
import commonModel from './common';
import { getSoldRankDetailList } from '../services/stat';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'soldStat',

  state: {
    // 2个筛选条件
    gmtStart: moment().startOf('month'),
    gmtEnd: moment().endOf('month'),

    // 表格数据
    soldStatDetailList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/reportStat/soldStat') {
          // 初始化数据
          dispatch({
            type: 'save',
            payload: {
              gmtStart: moment().startOf('month'),
              gmtEnd: moment().endOf('month'),
              current: 1,
              pageSize: 10,
            },
          });

          // dispatch({
          //   type: 'getSoldRankDetailList',
          // });
        }
      });
    },
  },

  effects: {
    *getSoldRankDetailList(_, { call, put, select }) {
      const { current, pageSize, gmtStart, gmtEnd } = yield select(state => state.soldStat);
      const response = yield call(getSoldRankDetailList, {
        current,
        pageSize,
        gmtStart: gmtStart.format('YYYY-MM-DD'),
        gmtEnd: gmtEnd.format('YYYY-MM-DD'),
      });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            soldStatDetailList: response.data.list,
            total: response.data.total,
          },
        });
      }
    },
  },

  reducers: {},
});
