import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getStudyDetail(params) {
  return request(`${config.APIV1}/admin/contentStudy/get?${stringify(params)}`);
}

export async function addStudy(params) {
  return request(`${config.APIV1}/admin/contentStudy/add`, {
    method: 'POST',
    body: params,
  });
}

export async function updateStudy(params) {
  return request(`${config.APIV1}/admin/contentStudy/update`, {
    method: 'POST',
    body: params,
  });
}

export async function updateStatus(params) {
  return request(`${config.APIV1}/admin/contentStudy/updateStatus?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function getStudyListPage(params) {
  return request(
    `${config.APIV1}/admin/contentStudy/queryPageList?${stringify({
      pageNum: params.current,
      pageSize: params.pageSize,
    })}`,
    {
      method: 'POST',
      body: {},
    }
  );
}
