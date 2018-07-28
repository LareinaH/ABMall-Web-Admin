import { stringify } from 'qs';
import config from '../utils/config';
import request from '../utils/request';

export async function getOptionMapList(enumType) {
  return request(
    `${config.APIV1}/admin/enum?${stringify({
      name: enumType,
    })}`
  );
}
