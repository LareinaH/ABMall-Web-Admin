import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getMemberList(params) {
  const { name, phoneNum, level, gmtStart, gmtEnd } = params;
  return request(
    `${config.APIV1}/admin/member/queryPageList?${stringify({
      pageNum: params.current,
      pageSize: params.pageSize,
    })}`,
    {
      method: 'POST',
      body: {
        name,
        phoneNum,
        level,
        gmtStart,
        gmtEnd,
      },
    }
  );
}
