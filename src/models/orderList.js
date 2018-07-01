import modelExtend from 'dva-model-extend';
import moment from 'moment';
import commonModel from './common';
import { getOptionMapList, getOrderList } from '../services/orderManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'orderList',

  state: {
    daysRange: 0,
    dateStart: moment(),
    dateEnd: moment(),
    orderStatus: undefined,
    orderStatusMapList: [],
    returnsStatus: undefined,
    returnsStatusMapList: [],
    searchOrderId: undefined,
    orderDetailListData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/orderManage/orderList') {
          dispatch({
            type: 'getOptionMapList',
            payload: {
              enumType: 'OrderStatus',
              key: 'orderStatusMapList',
            },
          });

          dispatch({
            type: 'getOptionMapList',
            payload: {
              enumType: 'returnStatus',
              key: 'returnsStatusMapList',
            },
          });

          dispatch({
            type: 'getOrderList',
          });
        }
      });
    },
  },

  effects: {
    *getOrderList(_, { call, put, select }) {
      const {
        current,
        pageSize,
        dateStart,
        dateEnd,
        orderStatus,
        returnsStatus,
        searchOrderId,
      } = yield select(state => state.orderList);
      const response = yield call(getOrderList, {
        orderNo: searchOrderId,
        current,
        pageSize,
        dateStart: dateStart.format('YYYY-MM-DD'),
        dateEnd: dateEnd.format('YYYY-MM-DD'),
        orderStatus,
        returnsStatus,
      });
      if (response.code === 200) {
        yield put({
          type: 'setDatas',
          payload: [
            {
              key: 'orderDetailListData',
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

    *getOptionMapList({ payload }, { call, put }) {
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
  },

  reducers: {},
});
