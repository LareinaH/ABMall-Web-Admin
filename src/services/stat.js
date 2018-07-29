import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getOrderStatusStats(params) {
  return request(`${config.APIV1}/admin/stat/getOrderStatusStats?${stringify(params)}`);
}

export async function getUserStat() {
  return request(`${config.APIV1}/admin/stat/memberStat`);
}

export async function getSoldRankDetailList(params) {
  const { gmtStart, gmtEnd } = params;
  return request(
    `${config.APIV1}/admin/stat/getSoldRankDetailList?${stringify({
      pageNum: params.current,
      pageSize: params.pageSize,
    })}`,
    {
      method: 'POST',
      body: {
        gmtStart,
        gmtEnd,
      },
    }
  );
}

export async function getOrdersRanklList(params) {
  const { gmtStart, gmtEnd } = params;
  return request(
    `${config.APIV1}/admin/stat/ordersRank?${stringify({
      pageNum: params.current,
      pageSize: params.pageSize,
    })}`,
    {
      method: 'POST',
      body: {
        gmtStart,
        gmtEnd,
      },
    }
  );
}
