import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getNoticeDetail(params) {
  return request(`${config.APIV1}/admin/msgPlatformMessage/get?${stringify(params)}`);
}

export async function addNotice(params) {
  return request(`${config.APIV1}/admin/msgPlatformMessage/add`, {
    method: 'POST',
    body: params,
  });
}

export async function updateNotice(params) {
  return request(`${config.APIV1}/admin/msgPlatformMessage/update`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteNotice(params) {
  return request(`${config.APIV1}/admin/msgPlatformMessage/delete?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getNoticeListPage(params) {
  return request(
    `${config.APIV1}/admin/msgPlatformMessage/queryPageList?${stringify({
      pageNum: params.current,
      pageSize: params.pageSize,
    })}`,
    {
      method: 'POST',
      body: {},
    }
  );
}
