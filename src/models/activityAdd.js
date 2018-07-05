import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { parse } from 'query-string';
import { routerRedux } from 'dva/router';
import commonModel from './common';
import { getActivityDetail, addActivity, updateActivity } from '../services/activityManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'activityAdd',

  state: {
    id: undefined,
    activityName: undefined,
    gmtStart: moment(),
    gmtEnd: moment(),
    activityDesc: '',
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
              { key: 'gmtStart', value: moment() },
              { key: 'gmtEnd', value: moment() },
              { key: 'activityDesc', value: '' },
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
        }
      });
    },
  },

  effects: {
    *getActivityDetail({ payload }, { call, put }) {
      const response = yield call(getActivityDetail, {
        msgPlatformMessageId: payload,
      });

      if (response.code === 200) {
        const { title, adsUrl, gmtPublish, level } = response.data;
        const data = {};
        Object.assign(data, {
          title,
          level,
          adsUrl: [
            {
              adUrl: adsUrl,
              uploading: false,
            },
          ],
          gmtPublish: moment(gmtPublish, 'YYYY-MM-DD HH:mm:ss'),
        });

        yield put({
          type: 'save',
          payload: data,
        });
      } else {
        yield put({
          type: 'showActivity',
          payload: `获取通知信息失败:${response.message}`,
        });
      }
    },
    *addActivity(_, { call, put, select }) {
      const { title, adsUrl, gmtPublish, level } = yield select(state => state.noticeAdd);

      const response = yield call(addActivity, {
        title,
        level,
        gmtPublish: gmtPublish.format('YYYY-MM-DD HH:mm:ss'),
        adsUrl: adsUrl
          .map(x => x.adUrl)
          .filter(x => x && x.length > 0)
          .join(''),
      });

      if (response.code === 200) {
        yield put({
          type: 'showActivity',
          payload: '添加通知成功',
        });

        // 跳转到商品列表页
        yield put(routerRedux.push('/platformActivity/noticeList'));
      } else {
        yield put({
          type: 'showActivity',
          payload: `添加通知失败:${response.message}`,
        });
      }
    },
    *updateActivity(_, { call, put, select }) {
      const { id, title, adsUrl, gmtPublish, level } = yield select(state => state.noticeAdd);

      const response = yield call(updateActivity, {
        id,
        title,
        level,
        gmtPublish: gmtPublish.format('YYYY-MM-DD HH:mm:ss'),
        adsUrl: adsUrl
          .map(x => x.adUrl)
          .filter(x => x && x.length > 0)
          .join(''),
      });

      if (response.code === 200) {
        yield put({
          type: 'showActivity',
          payload: '更新通知成功',
        });
      } else {
        yield put({
          type: 'showActivity',
          payload: `更新通知失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
