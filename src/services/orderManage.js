import { stringify } from 'qs';
import request from '../utils/request';
import config from '../utils/config';

export async function getOptionMapList(enumType) {
  return request(
    `${config.APIV1}/admin/enum?${stringify({
      name: enumType,
    })}`
  );
}

export async function getOrderList(params) {
  return request(
    `${config.APIV1}/admin/orders/queryPageList?${stringify({
      pageNum: params.current,
      pageSize: params.pageSize,
      conditions: JSON.stringify({
        timeBegin: params.dateStart,
        timeEnd: params.dateEnd,
        orderStatus: params.orderStatus,
        returnStatus: params.returnsStatus,
        orderNo: params.orderNo,
      }),
    })}`
  );
}
