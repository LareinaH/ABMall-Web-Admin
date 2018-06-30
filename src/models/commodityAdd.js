import modelExtend from 'dva-model-extend';
import { parse } from 'query-string';
import commonModel from './common';
import { getGoodsDetail, addGoods, updateGoods } from '../services/commodityAdd';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'commodityAdd',

  state: {
    // 额外信息
    categoryList: [],
    specUnitList: [],

    // goodsVo
    goodsVo: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/commodityManage/commodityAdd') {
          // 取商品ID
          console.log(search);
          const { goodsId } = parse(search);
          if (goodsId) {
            dispatch({
              type: 'getCommodityDetail',
              payload: goodsId,
            });
          }

          dispatch({
            type: 'getCategoryList',
          });

          dispatch({
            type: 'getSpecUnitList',
          });
        }
      });
    },
  },

  effects: {
    *getCommodityDetail({ payload }, { call, put }) {
      const response = yield call(getGoodsDetail, {
        goodsId: payload,
      });

      if (response.code === 200) {
        const { images, description } = response.data;

        Object.assign(response.data, {
          images: images.split(','),
          description: description.split(','),
        });

        yield put({
          type: 'setData',
          payload: {
            key: 'goodsVo',
            value: response.data,
          },
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `获取商品信息失败:${response.message}`,
        });
      }
    },
    *addCommodity(_, { call, put, select }) {
      const { goodsVo } = yield select(state => state.commodityAdd);
      const { images, description } = goodsVo;

      Object.assign(goodsVo, {
        images: images.join(','),
        description: description.join(','),
      });

      const response = yield call(addGoods, goodsVo);

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '添加商品成功',
        });

        // 跳转到商品列表页
      } else {
        yield put({
          type: 'showNotice',
          payload: `添加商品失败:${response.message}`,
        });
      }
    },
    *updateCommodity(_, { call, put, select }) {
      const { goodsVo } = yield select(state => state.commodityAdd);
      const { images, description } = goodsVo;

      Object.assign(goodsVo, {
        images: images.join(','),
        description: description.join(','),
      });

      const response = yield call(updateGoods, goodsVo);

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '更新商品信息成功',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `更新商品信息失败:${response.message}`,
        });
      }
    },
  },

  reducers: {
    setGoodsVo(state, { payload }) {
      const { key, value } = payload;
      const { goodsVo } = state;
      goodsVo[key] = value;
      return {
        ...state,
        goodsVo,
      };
    },
  },
});
