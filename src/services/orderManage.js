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
    })}`,
    {
      method: 'POST',
      body: {
        timeBegin: params.dateStart,
        timeEnd: params.dateEnd,
        orderStatus: params.orderStatus,
        returnStatus: params.returnsStatus,
        orderNo: params.orderNo,
      },
    }
  );
}

export async function delivery(params) {
  return request(
    `${config.APIV1}/admin/orders/delivery?${stringify({
      orderId: params.orderId,
      logisticCode: params.trackingNumber,
    })}`,
    {
      method: 'POST',
    }
  );
}

export async function replenish(params) {
  return request(
    `${config.APIV1}/admin/orders/replenish?${stringify({
      orderId: params.orderId,
      logisticCode: params.trackingNumber,
    })}`,
    {
      method: 'POST',
    }
  );
}

export async function systemCancel(params) {
  return request(
    `${config.APIV1}/admin/orders/systemCancel?${stringify({
      orderId: params.orderId,
    })}`,
    {
      method: 'POST',
    }
  );
}
