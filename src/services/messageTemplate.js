import request from '../utils/request';
import config from '../utils/config';

export async function getKeyValues() {
  return request(`${config.APIV1}/admin/msgMessageTemplate/config`);
}

export async function saveKeyPairs(params) {
  return request(`${config.APIV1}/admin/msgMessageTemplate/updateConfig`, {
    method: 'POST',
    body: params,
  });
}
