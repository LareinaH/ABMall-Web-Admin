import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getPicList(params) {
  return request(`${config.APIV1}/admin/ads/queryList?${stringify(params)}`);
}

export async function saveAdUrl(params) {
  return request(`${config.APIV1}/admin/ads/update`, {
    method: 'POST',
    body: params,
  });
}
