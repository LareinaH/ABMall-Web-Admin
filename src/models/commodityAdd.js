import modelExtend from 'dva-model-extend';
import { parse } from 'query-string';
import { routerRedux } from 'dva/router';
import commonModel from './common';
import { getGoodsDetail, addGoods, updateGoods, getSpecUnitList } from '../services/commodityAdd';
import { getCategoryList } from '../services/commodityManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'commodityAdd',

  state: {
    // 额外信息
    categoryList: [],
    specUnitList: [],

    // goodsVo
    goodsVo: {
      goodsName: undefined,
      groupId: undefined,
      images: [
        {
          adUrl: '',
          uploading: false,
        },
      ],
      virtualSalesAmount: 0,
      description: [
        {
          adUrl: '',
          uploading: false,
        },
      ],
      goodsSpecificationList: [],
      breif: undefined,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/commodityManage/commodityAdd') {
          // 进入页面需要清空数据
          dispatch({
            type: 'setDatas',
            payload: [
              { key: 'categoryList', value: [] },
              { key: 'specUnitList', value: [] },
              { key: 'noticeVisible', value: false },
              { key: 'noticeInfo', value: '' },
              {
                key: 'goodsVo',
                value: {
                  goodsName: undefined,
                  groupId: undefined,
                  images: [
                    {
                      adUrl: '',
                      uploading: false,
                    },
                  ],
                  virtualSalesAmount: 0,
                  description: [
                    {
                      adUrl: '',
                      uploading: false,
                    },
                  ],
                  goodsSpecificationList: [],
                  breif: undefined,
                },
              },
            ],
          });

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
    *getCommodityDetail({ payload }, { call, put, select }) {
      const response = yield call(getGoodsDetail, {
        goodsId: payload,
      });

      if (response.code === 200) {
        const { goodsVo } = yield select(state => state.commodityAdd);
        const { images: oldImages, description: oldDescription } = goodsVo;
        let { images, description } = response.data;

        images = JSON.parse(images).map(x => {
          return {
            uploading: false,
            adUrl: x,
          };
        });

        images.push(...oldImages);

        description = JSON.parse(description).map(x => {
          return {
            uploading: false,
            adUrl: x,
          };
        });

        description.push(...oldDescription);

        Object.assign(response.data, {
          images,
          description,
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

      const copiedGoodsVo = JSON.parse(JSON.stringify(goodsVo));

      Object.assign(copiedGoodsVo, {
        images: images.map(x => x.adUrl).filter(x => x && x.length > 0),
        description: description.map(x => x.adUrl).filter(x => x && x.length > 0),
      });

      const response = yield call(addGoods, goodsVo);

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '添加商品成功',
        });

        // 跳转到商品列表页
        yield put(routerRedux.push('/commodityManage/commodityList'));
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

      const copiedGoodsVo = JSON.parse(JSON.stringify(goodsVo));

      Object.assign(copiedGoodsVo, {
        images: images.map(x => x.adUrl).filter(x => x && x.length > 0),
        description: description.map(x => x.adUrl).filter(x => x && x.length > 0),
      });

      const response = yield call(updateGoods, copiedGoodsVo);

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
    *getSpecUnitList({ payload }, { call, put }) {
      const response = yield call(getSpecUnitList, {
        goodsId: payload,
      });

      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'specUnitList',
            value: response.data,
          },
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
