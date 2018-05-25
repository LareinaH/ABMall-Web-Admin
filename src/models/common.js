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
  state: {},

  reducers: {
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

module.exports = {
  model,
  pageModel,
};
