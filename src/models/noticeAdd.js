import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { parse } from 'query-string';
import { routerRedux } from 'dva/router';
import commonModel from './common';
import { getNoticeDetail, addNotice, updateNotice } from '../services/noticeAdd';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'noticeAdd',

  state: {
    id: undefined,
    title: undefined,
    adsUrl: [
      {
        adUrl: '',
        uploading: false,
      },
    ],
    gmtPublish: moment(),
    level: 'IMPORTANT_EMERGENCY',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/platformNotice/noticeAdd') {
          // 进入页面需要清空数据
          dispatch({
            type: 'setDatas',
            payload: [
              { key: 'title', value: undefined },
              {
                key: 'adsUrl',
                value: [
                  {
                    adUrl: '',
                    uploading: false,
                  },
                ],
              },
              { key: 'gmtPublish', value: moment() },
              { key: 'level', value: 'IMPORTANT_EMERGENCY' },
            ],
          });

          // 取通知ID
          const { id } = parse(search);
          if (id) {
            dispatch({
              type: 'getNoticeDetail',
              payload: id,
            });
          }
        }
      });
    },
  },

  effects: {
    *getNoticeDetail({ payload }, { call, put }) {
      const response = yield call(getNoticeDetail, {
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
          type: 'showNotice',
          payload: `获取通知信息失败:${response.message}`,
        });
      }
    },
    *addNotice(_, { call, put, select }) {
      const { title, adsUrl, gmtPublish, level } = yield select(state => state.noticeAdd);

      const response = yield call(addNotice, {
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
          type: 'showNotice',
          payload: '添加通知成功',
        });

        // 跳转到商品列表页
        yield put(routerRedux.push('/platformNotice/noticeList'));
      } else {
        yield put({
          type: 'showNotice',
          payload: `添加通知失败:${response.message}`,
        });
      }
    },
    *updateNotice(_, { call, put, select }) {
      const { id, title, adsUrl, gmtPublish, level } = yield select(state => state.noticeAdd);

      const response = yield call(updateNotice, {
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
          type: 'showNotice',
          payload: '更新通知成功',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `更新通知失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
