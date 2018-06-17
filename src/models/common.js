import modelExtend from 'dva-model-extend';

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
  },
});

export default {
  model,
  pageModel,
};
