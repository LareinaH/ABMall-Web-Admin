import modelExtend from 'dva-model-extend';
import commonModel from './common';
import { getGoodsListPage, deleteGoods } from '../services/commodityAdd';
import { getCategoryList } from '../services/commodityManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'commodityList',

  state: {
    // 额外信息
    categoryList: [],

    goodsDetailList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/commodityManage/commodityList') {
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
      const { current, pageSize } = yield select(state => state.commodityList);
      const response = yield call(getGoodsListPage, {
        pageNum: current,
        pageSize,
      });
      if (response.code === 200) {
        yield put({
          type: 'setDatas',
          payload: [
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
  },

  reducers: {},
});
