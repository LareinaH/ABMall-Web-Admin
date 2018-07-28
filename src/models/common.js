import modelExtend from 'dva-model-extend';
import { getOptionMapList } from '../services/common';

const model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

const pageModel = modelExtend(model, {
  state: {
    noticeVisible: false,
    noticeInfo: '',
    current: 1,
    pageSize: 10,
    total: 0,
  },

  effects: {
    *getOptionMapList({ payload }, { call, put }) {
      const { enumType, key } = payload;
      const response = yield call(getOptionMapList, enumType);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            [key]: response.data,
          },
        });
      }
    },
  },

  reducers: {
    showNotice(state, { payload }) {
      return {
        ...state,
        noticeVisible: true,
        noticeInfo: payload,
      };
    },
    hideNotice(state) {
      return {
        ...state,
        noticeVisible: false,
        noticeInfo: '',
      };
    },
    //  设置state中的某个值
    setData(state, { payload }) {
      const { key, value } = payload;
      return {
        ...state,
        [key]: value,
      };
    },
    setDatas(state, { payload }) {
      const tempItem = {};
      payload.map(item => {
        return Object.assign(tempItem, { [item.key]: item.value });
      });

      return {
        ...state,
        ...tempItem,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});

export default {
  model,
  pageModel,
};
