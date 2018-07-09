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
    shopActivityGoods: {
      goodsId: undefined,
    },
    shopActivityConfigList: [
      { item: 'PROMOTION_TOTLE_MONEY', value: '0' },
      { item: 'ACTIVITY_TOTLE_SHARE_PEOPLE', value: '0' },
      { item: 'ACTIVITY_AWARD_V1', value: '0' },
      { item: 'ACTIVITY_AWARD_V2', value: '0' },
      { item: 'ACTIVITY_AWARD_V3', value: '0' },
    ],
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
              {
                key: 'shopActivityGoods',
                value: {
                  goodsId: undefined,
                },
              },
              {
                key: 'shopActivityConfigList',
                value: [
                  { item: 'PROMOTION_TOTLE_MONEY', value: '0' },
                  { item: 'ACTIVITY_TOTLE_SHARE_PEOPLE', value: '0' },
                  { item: 'ACTIVITY_AWARD_V1', value: '0' },
                  { item: 'ACTIVITY_AWARD_V2', value: '0' },
                  { item: 'ACTIVITY_AWARD_V3', value: '0' },
                ],
              },
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
          activityBrief,
          shopActivityGoods,
          shopActivityConfigList,
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
      const { activityName, gmtStart, gmtEnd, activityDesc, activityBrief } = yield select(
        state => state.activityAdd
      );
      const { shopActivityGoods, shopActivityConfigList } = yield select(
        state => state.activityAdd
      );

      const response = yield call(addActivity, {
        shopActivityGoods,
        shopActivityConfigList,
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
      const { id, activityName, gmtStart, gmtEnd, activityDesc, activityBrief } = yield select(
        state => state.activityAdd
      );
      const { shopActivityGoods, shopActivityConfigList } = yield select(
        state => state.activityAdd
      );

      const response = yield call(updateActivity, {
        shopActivityGoods,
        shopActivityConfigList,
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
