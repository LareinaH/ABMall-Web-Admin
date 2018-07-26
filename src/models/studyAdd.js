import modelExtend from 'dva-model-extend';
import { parse } from 'query-string';
import { routerRedux } from 'dva/router';
import commonModel from './common';
import { getStudyDetail, addStudy, updateStudy } from '../services/studyAdd';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'studyAdd',

  state: {
    id: undefined,
    title: undefined,
    brief: undefined,
    adsUrl: [
      {
        adUrl: '',
        uploading: false,
      },
    ],
    messageDetail: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/contentStudy/studyAdd') {
          // 进入页面需要清空数据
          dispatch({
            type: 'setDatas',
            payload: [
              { key: 'noticeVisible', value: false },
              { key: 'noticeInfo', value: '' },
              { key: 'id', value: undefined },
              { key: 'title', value: undefined },
              { key: 'brief', value: undefined },
              {
                key: 'adsUrl',
                value: [
                  {
                    adUrl: '',
                    uploading: false,
                  },
                ],
              },
              { key: 'messageDetail', value: undefined },
            ],
          });

          // 取通知ID
          const { id } = parse(search);
          if (id) {
            dispatch({
              type: 'getStudyDetail',
              payload: id,
            });
          }
        }
      });
    },
  },

  effects: {
    *getStudyDetail({ payload }, { call, put }) {
      const response = yield call(getStudyDetail, {
        contentStudyId: payload,
      });

      if (response.code === 200) {
        const { id, title, brief, adsUrl, messageDetail } = response.data;
        const data = {};
        Object.assign(data, {
          id,
          title,
          brief,
          messageDetail,
          adsUrl: [
            {
              adUrl: adsUrl,
              uploading: false,
            },
          ],
        });

        yield put({
          type: 'save',
          payload: data,
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `获取信息失败:${response.message}`,
        });
      }
    },
    *addStudy(_, { call, put, select }) {
      const { title, brief, adsUrl, messageDetail } = yield select(state => state.studyAdd);

      const response = yield call(addStudy, {
        title,
        brief,
        messageDetail,
        adsUrl: adsUrl
          .map(x => x.adUrl)
          .filter(x => x && x.length > 0)
          .join(''),
      });

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '添加成功',
        });

        // 跳转到商品列表页
        yield put(routerRedux.push('/contentStudy/studyList'));
      } else {
        yield put({
          type: 'showNotice',
          payload: `添加失败:${response.message}`,
        });
      }
    },
    *updateStudy(_, { call, put, select }) {
      const { id, title, brief, adsUrl, messageDetail } = yield select(state => state.studyAdd);

      const response = yield call(updateStudy, {
        id,
        title,
        brief,
        messageDetail,
        adsUrl: adsUrl
          .map(x => x.adUrl)
          .filter(x => x && x.length > 0)
          .join(''),
      });

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '更新成功',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `更新失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
