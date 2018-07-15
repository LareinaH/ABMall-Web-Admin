import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getGoodsDetail(params) {
  return request(`${config.APIV1}/admin/goods/get?${stringify(params)}`);
}

export async function addGoods(params) {
  return request(`${config.APIV1}/admin/goods/add`, {
    method: 'POST',
    body: params,
  });
}

export async function updateGoods(params) {
  return request(`${config.APIV1}/admin/goods/update`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteGoods(params) {
  return request(`${config.APIV1}/admin/goods/delete?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getGoodsListPage(params) {
  return request(
    `${config.APIV1}/admin/goods/queryPageList?${stringify({
      pageNum: params.pageNum,
      pageSize: params.pageSize,
    })}`,
    {
      method: 'POST',
      body: params.conditions,
    }
  );
}

export async function getSpecUnitList() {
  return request(`${config.APIV1}/admin/goods/getSpecUnitList`);
}

export async function getGoodsList() {
  return request(`${config.APIV1}/admin/goods/queryList`);
}

export async function setGoodsOnSaleStatus(params) {
  return request(`${config.APIV1}/admin/goods/setGoodsOnSaleStatus`, {
    method: 'POST',
    body: params,
  });
}
