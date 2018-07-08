import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { parse } from 'query-string';
import { routerRedux } from 'dva/router';
import commonModel from './common';
import { getActivityDetail, addActivity, updateActivity } from '../services/activityManage';
import { getGoodsList } from '../services/commodityAdd';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'activityAdd',

  state: {
    id: undefined,
    activityName: undefined,
    activityBrief: undefined,
    gmtStart: moment(),
    gmtEnd: moment(),
    activityDesc: undefined,
    goodsList: [],
    selectGoods: undefined,
    leastSales: 0,
    leastPerson: 0,
    v1Award: 0,
    v2Award: 0,
    v3Award: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/activityManage/activityAdd') {
          // 进入页面需要清空数据
          dispatch({
            type: 'setDatas',
            payload: [
              { key: 'id', value: undefined },
              { key: 'activityName', value: undefined },
              { key: 'activityBrief', value: undefined },
              { key: 'gmtStart', value: moment() },
              { key: 'gmtEnd', value: moment() },
              { key: 'activityDesc', value: undefined },
              { key: 'selectGoods', value: undefined },
              { key: 'leastSales', value: 0 },
              { key: 'leastPerson', value: 0 },
              { key: 'v1Award', value: 0 },
              { key: 'v2Award', value: 0 },
              { key: 'v3Award', value: 0 },
            ],
          });

          // 取通知ID
          const { id } = parse(search);
          if (id) {
            dispatch({
              type: 'getActivityDetail',
              payload: id,
            });
          }

          // 取商品列表
          dispatch({
            type: 'getGoodsList',
          });
        }
      });
    },
  },

  effects: {
    *getActivityDetail({ payload }, { call, put }) {
      const response = yield call(getActivityDetail, {
        shopActivitiesId: payload,
      });

      if (response.code === 200) {
        const { shopActivityGoods, shopActivityConfigList } = response.data;
        const { id, activityName, activityBrief, gmtStart, gmtEnd, activityDesc } = response.data;
        const data = {};
        Object.assign(data, {
          id,
          activityName,
          gmtStart: moment(gmtStart, 'YYYY-MM-DD HH:mm:ss'),
          gmtEnd: moment(gmtEnd, 'YYYY-MM-DD HH:mm:ss'),
          activityDesc,
          selectGoods: shopActivityGoods.goodsId,
          activityBrief,
        });

        shopActivityConfigList.forEach(item => {
          if (item.item === 'PROMOTION_TOTLE_MONEY') {
            Object.assign(data, {
              leastSales: Number.parseInt(item.value, 10),
            });
          }

          if (item.item === 'ACTIVITY_TOTLE_SHARE_PEOPLE') {
            Object.assign(data, {
              leastPerson: Number.parseInt(item.value, 10),
            });
          }

          if (item.item === 'ACTIVITY_AWARD_V1') {
            Object.assign(data, {
              v1Award: Number.parseInt(item.value, 10),
            });
          }

          if (item.item === 'ACTIVITY_AWARD_V2') {
            Object.assign(data, {
              v2Award: Number.parseInt(item.value, 10),
            });
          }

          if (item.item === 'ACTIVITY_AWARD_V3') {
            Object.assign(data, {
              v3Award: Number.parseInt(item.value, 10),
            });
          }
        });

        yield put({
          type: 'save',
          payload: data,
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `获取活动信息失败:${response.message}`,
        });
      }
    },
    *addActivity(_, { call, put, select }) {
      const {
        activityName,
        gmtStart,
        gmtEnd,
        activityDesc,
        selectGoods,
        activityBrief,
      } = yield select(state => state.activityAdd);
      const { leastSales, leastPerson, v1Award, v2Award, v3Award } = yield select(
        state => state.activityAdd
      );

      const response = yield call(addActivity, {
        shopActivityGoods: {
          goodsId: selectGoods,
        },
        shopActivityConfigList: [
          { item: 'PROMOTION_TOTLE_MONEY', value: leastSales.toString() },
          { item: 'ACTIVITY_TOTLE_SHARE_PEOPLE', value: leastPerson.toString() },
          { item: 'ACTIVITY_AWARD_V1', value: v1Award.toString() },
          { item: 'ACTIVITY_AWARD_V2', value: v2Award.toString() },
          { item: 'ACTIVITY_AWARD_V3', value: v3Award.toString() },
        ],
        activityName,
        gmtStart: gmtStart.format('YYYY-MM-DD HH:mm:ss'),
        gmtEnd: gmtEnd.format('YYYY-MM-DD HH:mm:ss'),
        activityDesc,
        activityBrief,
      });

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '添加活动成功',
        });

        // 跳转到商品列表页
        yield put(routerRedux.push('/activityManage/activityList'));
      } else {
        yield put({
          type: 'showNotice',
          payload: `添加活动失败:${response.message}`,
        });
      }
    },
    *updateActivity(_, { call, put, select }) {
      const {
        id,
        activityName,
        gmtStart,
        gmtEnd,
        activityDesc,
        selectGoods,
        activityBrief,
      } = yield select(state => state.activityAdd);
      const { leastSales, leastPerson, v1Award, v2Award, v3Award } = yield select(
        state => state.activityAdd
      );

      const response = yield call(updateActivity, {
        shopActivityGoods: {
          activityId: id,
          goodsId: selectGoods,
        },
        shopActivityConfigList: [
          {
            shopActivitesId: id,
            item: 'PROMOTshopActivitesId: id, ION_TOTLE_MONEY',
            value: leastSales.toString(),
          },
          {
            shopActivitesId: id,
            item: 'ACTIVITY_TOTLE_SHARE_PEOPLE',
            value: leastPerson.toString(),
          },
          { shopActivitesId: id, item: 'ACTIVITY_AWARD_V1', value: v1Award.toString() },
          { shopActivitesId: id, item: 'ACTIVITY_AWARD_V2', value: v2Award.toString() },
          { shopActivitesId: id, item: 'ACTIVITY_AWARD_V3', value: v3Award.toString() },
        ],
        id,
        activityName,
        gmtStart: gmtStart.format('YYYY-MM-DD HH:mm:ss'),
        gmtEnd: gmtEnd.format('YYYY-MM-DD HH:mm:ss'),
        activityDesc,
        activityBrief,
      });

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '更新活动成功',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `更新活动失败:${response.message}`,
        });
      }
    },
    *getGoodsList(_, { call, put }) {
      const response = yield call(getGoodsList);

      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'goodsList',
            value: response.data,
          },
        });
      }
    },
  },

  reducers: {},
});
