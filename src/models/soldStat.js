import modelExtend from 'dva-model-extend';
import moment from 'moment';
import commonModel from './common';
import { getSalesMoneyStat, getSalesMoneyTrend, getYearStat } from '../services/stat';
import { getNumberRange } from '../utils/utils';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'soldStat',

  state: {
    // 2个筛选条件
    gmtStart: moment().subtract(30, 'days'),
    gmtEnd: moment(),

    // 表格数据
    soldStatDetailList: [],
    statInfo: {},
    salesMoneyTrend: [],
    year: moment()
      .year()
      .toString(),
    yearList: getNumberRange(moment().year() - 10, moment().year() + 10, true),
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
              soldStatDetailList: [],
              statInfo: {},
              salesMoneyTrend: [],
              year: moment()
                .year()
                .toString(),
              yearList: getNumberRange(moment().year() - 10, moment().year() + 10, true),
            },
          });

          dispatch({
            type: 'getSalesMoneyStat',
          });

          dispatch({
            type: 'getSalesMoneyTrend',
          });

          dispatch({
            type: 'getYearStat',
          });
        }
      });
    },
  },

  effects: {
    *getSalesMoneyStat(_, { call, put }) {
      const response = yield call(getSalesMoneyStat);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            statInfo: response.data,
          },
        });
      }
    },
    *getSalesMoneyTrend(_, { select, call, put }) {
      const { gmtEnd, gmtStart } = yield select(state => state.soldStat);
      const response = yield call(getSalesMoneyTrend, {
        gmtStart: gmtStart.format('YYYY-MM-DD'),
        gmtEnd: gmtEnd.format('YYYY-MM-DD'),
      });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            salesMoneyTrend: response.data,
          },
        });
      }
    },
    *getYearStat(_, { select, call, put }) {
      const { year } = yield select(state => state.soldStat);
      const response = yield call(getYearStat, {
        year,
      });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            soldStatDetailList: response.data,
          },
        });
      }
    },
  },

  reducers: {},
});
