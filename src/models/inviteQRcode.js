import modelExtend from 'dva-model-extend';
import commonModel from './common';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'inviteQRcode',

  state: {},

  subscriptions: {
    setup({ history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/inviteQRcode') {
          // do nothing
        }
      });
    },
  },

  effects: {},

  reducers: {},
});
