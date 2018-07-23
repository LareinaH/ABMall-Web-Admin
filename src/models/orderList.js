import modelExtend from 'dva-model-extend';
import moment from 'moment';
import commonModel from './common';
import {
  getOptionMapList,
  getOrderList,
  delivery,
  replenish,
  systemCancel,
} from '../services/orderManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'orderList',

  state: {
    daysRange: 7,
    dateStart: moment().subtract(7, 'days'),
    dateEnd: moment(),
    orderStatus: undefined,
    orderStatusMapList: [],
    returnsStatus: undefined,
    returnsStatusMapList: [],
    searchOrderId: undefined,
    orderDetailListData: [],

    showEditorOrderModal: false,
    type: '发货',
    orderId: undefined,
    trackingNumber: undefined,
    orderNo: undefined,
    showTrackingInfo: true,
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

    *shipOrReplenish(_, { call, put, select }) {
      const { trackingNumber, orderId, type } = yield select(state => state.orderList);
      if (type !== '系统取消' && !trackingNumber) {
        yield put({
          type: 'showNotice',
          payload: '请填写运单号',
        });

        return null;
      }
      let response;
      if (type === '发货') {
        response = yield call(delivery, {
          orderId,
          trackingNumber,
        });
      } else if (type === '补货') {
        response = yield call(replenish, {
          orderId,
          trackingNumber,
        });
      } else {
        response = yield call(systemCancel, {
          orderId,
        });
      }

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: `${type}操作成功`,
        });

        yield put({
          type: 'setData',
          payload: {
            key: 'showEditorOrderModal',
            value: false,
          },
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `${type}操作失败:${response.message}`,
        });
      }

      yield put({
        type: 'getOrderList',
      });
    },
  },

  reducers: {},
});
