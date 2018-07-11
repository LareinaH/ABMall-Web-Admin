import modelExtend from 'dva-model-extend';
import moment from 'moment';
import commonModel from './common';
import { getOrderStatusStats } from '../services/stat';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'orderStat',

  state: {
    gmtStart: moment().startOf('month'),
    gmtEnd: moment().endOf('month'),
    data: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/orderManage/orderStat') {
          dispatch({
            type: 'getOrderStatusStats',
          });
        }
      });
    },
  },

  effects: {
    *getOrderStatusStats(_, { call, put, select }) {
      const { gmtEnd, gmtStart } = yield select(state => state.orderStat);
      const response = yield call(getOrderStatusStats, {
        gmtStart: gmtStart.format('YYYY-MM-DD'),
        gmtEnd: gmtEnd.format('YYYY-MM-DD'),
      });
      if (response.code === 200) {
        const convertRes = [];
        response.data.forEach(x => {
          if (x.orderStatus === 'WAIT_BUYER_PAY') {
            convertRes.push({
              orderStatus: '待付款',
              sum: x.sum,
            });
          } else if (x.orderStatus === 'WAIT_DELIVER') {
            convertRes.push({
              orderStatus: '待发货',
              sum: x.sum,
            });
          } else if (x.orderStatus === 'WAIT_CONFIRM') {
            convertRes.push({
              orderStatus: '待收货',
              sum: x.sum,
            });
          } else if (x.orderStatus === 'CONFIRMED') {
            convertRes.push({
              orderStatus: '确认收货',
              sum: x.sum,
            });
          } else if (x.orderStatus === 'CANCEL') {
            convertRes.push({
              orderStatus: '用户取消',
              sum: x.sum,
            });
          } else if (x.orderStatus === 'SYSTEM_CANCEL') {
            convertRes.push({
              orderStatus: '系统取消',
              sum: x.sum,
            });
          }
        });
        yield put({
          type: 'setDatas',
          payload: [
            {
              key: 'data',
              value: convertRes,
            },
          ],
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `查询订单统计信息失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
