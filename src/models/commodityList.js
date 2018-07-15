import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getGoodsListPage, deleteGoods, setGoodsOnSaleStatus } from '../services/commodityAdd';
import { getCategoryList } from '../services/commodityManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'commodityList',

  state: {
    // 额外信息
    categoryList: [],

    goodsDetailList: [],
    expandedRows: [],
    searchGoodsName: undefined,
    searchIsOnSale: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/commodityManage/offSold') {
          dispatch({
            type: 'setDatas',
            payload: [
              { key: 'searchGoodsName', value: undefined },
              { key: 'categoryList', value: [] },
              { key: 'expandedRows', value: [] },
              { key: 'goodsDetailList', value: [] },
              { key: 'searchIsOnSale', value: 'false' },
              { key: 'current', value: 1 },
            ],
          });

          dispatch({
            type: 'getCategoryList',
          });

          dispatch({
            type: 'getGoodsListPage',
          });
        }
        if (pathname === '/commodityManage/commodityList') {
          dispatch({
            type: 'setDatas',
            payload: [
              { key: 'searchGoodsName', value: undefined },
              { key: 'categoryList', value: [] },
              { key: 'expandedRows', value: [] },
              { key: 'goodsDetailList', value: [] },
              { key: 'searchIsOnSale', value: undefined },
              { key: 'current', value: 1 },
            ],
          });

          dispatch({
            type: 'getCategoryList',
          });

          dispatch({
            type: 'getGoodsListPage',
          });
        }
      });
    },
  },

  effects: {
    *getGoodsListPage(_, { call, put, select }) {
      const { current, pageSize, searchGoodsName, searchIsOnSale } = yield select(
        state => state.commodityList
      );
      const response = yield call(getGoodsListPage, {
        pageNum: current,
        pageSize,
        conditions: {
          goodsName: searchGoodsName,
          isOnSell:
            searchIsOnSale === 'true' ? true : searchIsOnSale === 'false' ? false : undefined,
        },
      });
      if (response.code === 200) {
        yield put({
          type: 'setDatas',
          payload: [
            {
              key: 'expandedRows',
              value: response.data.list.map(x => x.id),
            },
            {
              key: 'goodsDetailList',
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
    *getCategoryList({ payload }, { call, put }) {
      const response = yield call(getCategoryList, {
        goodsId: payload,
      });

      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'categoryList',
            value: response.data,
          },
        });
      }
    },
    *deleteGoods({ payload }, { call, put }) {
      const response = yield call(deleteGoods, {
        goodsId: payload,
      });

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '删除商品成功',
        });

        yield put({
          type: 'getGoodsListPage',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `删除商品失败:${response.message}`,
        });
      }
    },
    *setGoodsOnSaleStatus({ payload }, { call, put }) {
      const response = yield call(setGoodsOnSaleStatus, payload);

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '操作成功',
        });

        yield put({
          type: 'getGoodsListPage',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `操作失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
