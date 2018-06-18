import modelExtend from 'dva-model-extend';
import commonModel from './common';
import {
  addCategory,
  getCategoryList,
  updateCategory,
  deleteCategory,
} from '../services/commodityManage';

const { pageModel } = commonModel;

export default modelExtend(pageModel, {
  namespace: 'categoryManage',

  state: {
    categoryListData: [],
    showAddCategory: false,
    showUpdateCategory: false,
    currentEditCategory: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/commodityManage/categoryManage') {
          dispatch({
            type: 'getCategoryList',
          });
        }
      });
    },
  },

  effects: {
    *getCategoryList(_, { call, put }) {
      const response = yield call(getCategoryList);
      if (response.code === 200) {
        yield put({
          type: 'setData',
          payload: {
            key: 'categoryListData',
            value: response.data,
          },
        });
      }
    },
    *addCategory({ payload }, { call, put }) {
      const { categoryName } = payload;
      const response = yield call(addCategory, {
        goodsGroupName: categoryName,
      });

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '添加分类成功',
        });

        yield put({
          type: 'setData',
          payload: {
            key: 'showAddCategory',
            value: false,
          },
        });

        yield put({
          type: 'getCategoryList',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `添加分类失败:${response.message}`,
        });
      }
    },
    *updateCategory({ payload }, { call, put, select }) {
      const { newCategoryName } = payload;
      const { currentEditCategory } = yield select(state => state.categoryManage);
      currentEditCategory.goodsGroupName = newCategoryName;
      const response = yield call(updateCategory, {
        ...currentEditCategory,
      });

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '编辑分类成功',
        });

        yield put({
          type: 'setData',
          payload: {
            key: 'showUpdateCategory',
            value: false,
          },
        });

        yield put({
          type: 'getCategoryList',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `编辑分类失败:${response.message}`,
        });
      }
    },
    *deleteCategory({ payload }, { call, put }) {
      const response = yield call(deleteCategory, {
        goodsGroupId: payload,
      });

      console.log(response.code === 200);

      if (response.code === 200) {
        yield put({
          type: 'showNotice',
          payload: '删除分类成功',
        });

        yield put({
          type: 'getCategoryList',
        });
      } else {
        yield put({
          type: 'showNotice',
          payload: `删除分类失败:${response.message}`,
        });
      }
    },
  },

  reducers: {},
});
