import request from '../utils/request';
import config from '../utils/config';

export async function getKeyValues() {
  return request(`${config.APIV1}/admin/distributionConfig/config`);
}

export async function saveKeyPairs(params) {
  return request(`${config.APIV1}/admin/distributionConfig/updateConfig`, {
    method: 'POST',
    body: params,
  });
}
