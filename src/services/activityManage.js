import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getActivityDetail(params) {
  return request(`${config.APIV1}/admin/shopActivities/get?${stringify(params)}`);
}

export async function addActivity(params) {
  return request(`${config.APIV1}/admin/shopActivities/add`, {
    method: 'POST',
    body: params,
  });
}

export async function updateActivity(params) {
  return request(`${config.APIV1}/admin/shopActivities/update`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteActivity(params) {
  return request(`${config.APIV1}/admin/shopActivities/delete?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getActivityListPage(params) {
  return request(
    `${config.APIV1}/admin/shopActivities/queryPageList?${stringify({
      pageNum: params.current,
      pageSize: params.pageSize,
    })}`,
    {
      method: 'POST',
      body: {},
    }
  );
}
