import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function addCategory(params) {
  return request(`${config.APIV1}/admin/goodsGroup/add`, {
    method: 'POST',
    body: params,
  });
}

export async function getCategoryList() {
  return request(`${config.APIV1}/admin/goodsGroup/queryList`);
}

export async function updateCategory(params) {
  return request(`${config.APIV1}/admin/goodsGroup/update`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteCategory(params) {
  return request(`${config.APIV1}/admin/goodsGroup/delete?${stringify(params)}`, {
    method: 'DELETE',
  });
}
