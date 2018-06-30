import request from '../utils/request';
import config from '../utils/config';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${config.APIV1}/admin/getLoginUser`);
}
