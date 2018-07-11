import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getOrderStatusStats(params) {
  return request(`${config.APIV1}/admin/stat/getOrderStatusStats?${stringify(params)}`);
}
