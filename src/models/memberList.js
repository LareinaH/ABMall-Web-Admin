import modelExtend from 'dva-model-extend';
import moment from 'moment';
import commonModel from './common';
import { getMemberList } from '../services/memberList';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'memberList',

  state: {
    // 用户级别枚举列表
    memberLevelList: [],
    // 5个筛选条件
    gmtStart: moment().startOf('month'),
    gmtEnd: moment().endOf('month'),
    phoneNum: undefined,
    level: undefined,
    name: undefined,

    // 表格数据
    memberDetailList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/reportStat/memberList') {
          dispatch({
            type: 'getOptionMapList',
            payload: {
              enumType: 'memberLevel',
              key: 'memberLevelList',
            },
          });

          // 初始化数据
          dispatch({
            type: 'save',
            payload: {
              gmtStart: moment().startOf('month'),
              gmtEnd: moment().endOf('month'),
              phoneNum: undefined,
              level: undefined,
              name: undefined,
              current: 1,
              pageSize: 10,
            },
          });

          dispatch({
            type: 'getMemberList',
          });
        }
      });
    },
  },

  effects: {
    *getMemberList(_, { call, put, select }) {
      const { current, pageSize, phoneNum, level, name, gmtStart, gmtEnd } = yield select(
        state => state.memberList
      );
      const response = yield call(getMemberList, {
        current,
        pageSize,
        phoneNum,
        level,
        name,
        gmtStart: gmtStart.format('YYYY-MM-DD'),
        gmtEnd: gmtEnd.format('YYYY-MM-DD'),
      });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            memberDetailList: response.data.list,
            total: response.data.total,
          },
        });
      }
    },
  },

  reducers: {},
});
