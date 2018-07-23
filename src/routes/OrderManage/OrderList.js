import React from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Input,
  Button,
  Table,
  Alert,
  Modal,
  Radio,
  Badge,
} from 'antd';
import NoticeModal from '../NoticeModal';
import FormRow from '../../components/MyComponent/FormRow';

import config from '../../utils/config';
import { addAlignForColumns } from '../../utils/utils';

const { APIV1 } = config;

const { RangePicker } = DatePicker;
const { Search } = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const OrderList = ({ dispatch, loading, orderList }) => {
  const { dateStart, dateEnd, daysRange } = orderList;
  const {
    orderStatus,
    orderStatusMapList,
    returnsStatus,
    returnsStatusMapList,
    searchOrderId,
  } = orderList;

  const { showEditorOrderModal, type, trackingNumber, orderNo, showTrackingInfo } = orderList;

  const { orderDetailListData } = orderList;
  const { current, pageSize, total } = orderList;

  const onDaysRangeChange = dateArray => {
    dispatch({
      type: 'orderList/setDatas',
      payload: [{ key: 'dateStart', value: dateArray[0] }, { key: 'dateEnd', value: dateArray[1] }],
    });

    dispatch({
      type: 'orderList/getOrderList',
    });
  };

  const onOrderStatusChange = value => {
    dispatch({
      type: 'orderList/setDatas',
      payload: [{ key: 'orderStatus', value }, { key: 'current', value: 1 }],
    });

    dispatch({
      type: 'orderList/getOrderList',
    });
  };
  const onReturnsStatusChange = value => {
    dispatch({
      type: 'orderList/setDatas',
      payload: [{ key: 'returnsStatus', value }, { key: 'current', value: 1 }],
    });

    dispatch({
      type: 'orderList/getOrderList',
    });
  };

  const onDaysSelectChange = value => {
    dispatch({
      type: 'orderList/setDatas',
      payload: [{ key: 'daysRange', value }, { key: 'current', value: 1 }],
    });

    onDaysRangeChange([moment().subtract(Number.parseInt(value, 10), 'days'), moment()]);
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      align: 'center',
    },
    {
      title: '下单时间',
      dataIndex: 'gmtCreate',
      render: text => {
        const splitArray = text.split(' ');
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{splitArray[0]}</div>
            <div>{splitArray[1]}</div>
          </div>
        );
      },
    },
    {
      title: '订单来源',
      dataIndex: 'orderSource',
    },
    {
      title: '收件联系方式',
      width: '15%',
      render: (text, record) => (
        <div>
          <div>{`${record.receiverName} ${record.receiverPhone}`}</div>
          <div>
            {`${record.receiverProvinceName}省${record.receiverCityName}市${
              record.receiverCountyName
            }区${record.receiverAddress}`}
          </div>
        </div>
      ),
    },
    {
      title: '商品详情',
      render: (text, record) => {
        return `${record.goodsSpecificationNo},${record.goodName},${
          record.goodsSpecificationName
        } * ${record.goodNum}`;
      },
    },
    {
      title: '实付金额',
      dataIndex: 'totalMoney',
    },
    {
      title: '总返利金额',
      dataIndex: 'rebateMoney',
    },
    {
      title: '订单状态',
      render: (text, record) => {
        return orderStatusMapList
          .filter(x => x.value === record.orderStatus)
          .map(x => x.label)
          .join(',');
      },
    },
    {
      title: '快递单号',
      dataIndex: 'logisticCode',
    },
    {
      title: '补货状态',
      render: (text, record) => {
        const st = returnsStatusMapList
          .filter(x => x.value === record.returnStatus)
          .map(x => x.label)
          .join(',');
        if (st === '正常') {
          return <Badge status="success" text={st} />;
        } else {
          return <Badge status="warning" text={st} />;
        }
      },
    },
    // {
    //   title: '订单变更时间',
    //   dataIndex: 'gmtModify',
    //   render: text => {
    //     const splitArray = text.split(' ');
    //     return (
    //       <div style={{ textAlign: 'center' }}>
    //         <div>{splitArray[0]}</div>
    //         <div>{splitArray[1]}</div>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: '订单会员手机号',
    //   dataIndex: 'memberPhone',
    // },
    {
      title: '操作',
      fixed: 'right',
      render: (text, record) => (
        <div>
          <a
            onClick={() => {
              dispatch({
                type: 'orderList/setDatas',
                payload: [
                  {
                    key: 'showEditorOrderModal',
                    value: true,
                  },
                  {
                    key: 'orderId',
                    value: record.id,
                  },
                  {
                    key: 'orderNo',
                    value: record.orderNo,
                  },
                  {
                    key: 'trackingNumber',
                    value: undefined,
                  },
                  {
                    key: 'showTrackingInfo',
                    value: true,
                  },
                  {
                    key: 'type',
                    value: '发货',
                  },
                ],
              });
            }}
          >
            编辑
          </a>
        </div>
      ),
    },
  ];

  addAlignForColumns(columns, 'center');

  const showTotal = totalRecord => {
    return `共 ${totalRecord} 条数据`;
  };

  const tableProps = {
    dataSource: orderDetailListData,
    columns,
    rowKey: 'id',
    loading: loading.effects['orderList/getOrderList'],
    // size: 'small',
    pagination: {
      // size: 'small',
      showTotal,
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 10,
      current,
      pageSize,
      total,
    },
    onChange: pagination => {
      dispatch({
        type: 'orderList/setDatas',
        payload: [
          { key: 'current', value: pagination.current },
          { key: 'pageSize', value: pagination.pageSize },
        ],
      });

      dispatch({
        type: 'orderList/getOrderList',
      });
    },
    // scroll: {
    //   x: 1024,
    //   y: 768,
    // },
  };

  return (
    <Card>
      <Row>
        <Col span={24}>
          <RangePicker
            style={{ marginRight: 8 }}
            onChange={onDaysRangeChange}
            value={[dateStart, dateEnd]}
          />
          <Select
            allowClear={false}
            style={{ width: 120 }}
            value={daysRange.toString()}
            onChange={onDaysSelectChange}
          >
            <Select.Option key="7">最近7天</Select.Option>
            <Select.Option key="30">最近30天</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Select
            allowClear
            placeholder="请选择订单状态"
            style={{ width: 240, marginRight: 8 }}
            value={orderStatus}
            onChange={onOrderStatusChange}
          >
            {orderStatusMapList.map(item => (
              <Select.Option key={item.value}>{item.label}</Select.Option>
            ))}
          </Select>
          <Select
            allowClear
            placeholder="请选择退/补货状态"
            style={{ width: 240 }}
            value={returnsStatus}
            onChange={onReturnsStatusChange}
          >
            {returnsStatusMapList.map(item => (
              <Select.Option key={item.value}>{item.label}</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Search
            placeholder="按订单号查询"
            onSearch={() => {
              dispatch({
                type: 'orderList/setDatas',
                payload: [{ key: 'current', value: 1 }],
              });

              dispatch({
                type: 'orderList/getOrderList',
              });
            }}
            enterButton
            style={{ width: 300 }}
            value={searchOrderId}
            onChange={e => {
              dispatch({
                type: 'orderList/setDatas',
                payload: [{ key: 'searchOrderId', value: e.target.value }],
              });
            }}
          />
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            icon="close"
            onClick={() => {
              dispatch({
                type: 'orderList/setDatas',
                payload: [
                  { key: 'searchOrderId', value: undefined },
                  { key: 'orderStatus', value: undefined },
                  { key: 'returnsStatus', value: undefined },
                  { key: 'daysRange', value: 7 },
                  { key: 'dateStart', value: moment().subtract(7, 'days') },
                  { key: 'dateEnd', value: moment() },
                ],
              });

              dispatch({
                type: 'orderList/getOrderList',
              });
            }}
          >
            重置查询条件
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            icon="export"
            onClick={() => {
              const url = `${APIV1}/admin/exportOrder?${stringify({
                orderStatus,
                returnsStatus,
                timeBegin: dateStart.format('YYYY-MM-DD'),
                timeEnd: dateEnd.format('YYYY-MM-DD'),
                orderNo,
              })}`;
              const aElem = document.createElement('a');
              aElem.href = url;
              const evt = document.createEvent('MouseEvents');
              evt.initEvent('click', true, true);
              aElem.dispatchEvent(evt);
            }}
          >
            导出订单列表
          </Button>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Alert
            message="注意"
            description={
              <ul>
                <li>1.待处理的订单超过48小时后状态更改为未发货，请及时进行处理</li>
                <li>2.已发货订单超过15个工作日后未处理自动变更成为已收货状态，请及时做好跟进</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table {...tableProps} />
        </Col>
      </Row>

      <Modal
        title="编辑"
        visible={showEditorOrderModal}
        onCancel={() => {
          dispatch({
            type: 'orderList/setData',
            payload: {
              key: 'showEditorOrderModal',
              value: false,
            },
          });
        }}
        onOk={() => {
          dispatch({
            type: 'orderList/shipOrReplenish',
          });
        }}
        destroyOnClose
        width="50%"
        confirmLoading={loading.effects['orderList/shipOrReplenish']}
      >
        <FormRow label="订单号" labelSpan={4} contentSpan={6}>
          <Input placeholder="订单号" style={{ width: 400 }} value={orderNo} disabled />
        </FormRow>
        <FormRow label="类型" labelSpan={4} contentSpan={6}>
          <RadioGroup
            onChange={e => {
              dispatch({
                type: 'orderList/setData',
                payload: {
                  key: 'type',
                  value: e.target.value,
                },
              });

              if (e.target.value === '系统取消') {
                dispatch({
                  type: 'orderList/setData',
                  payload: {
                    key: 'showTrackingInfo',
                    value: false,
                  },
                });
              } else {
                dispatch({
                  type: 'orderList/setData',
                  payload: {
                    key: 'showTrackingInfo',
                    value: true,
                  },
                });
              }
            }}
            value={type}
          >
            <RadioButton value="发货">发货</RadioButton>
            <RadioButton value="补货">补货</RadioButton>
            <RadioButton value="系统取消">系统取消</RadioButton>
          </RadioGroup>
        </FormRow>
        <FormRow visible={showTrackingInfo} label="物流公司" labelSpan={4} contentSpan={6}>
          <Select value="ems" style={{ width: 300 }}>
            <Select.Option value="ems">中国邮政</Select.Option>
          </Select>
        </FormRow>
        <FormRow visible={showTrackingInfo} label="运单号" labelSpan={4} contentSpan={6}>
          <Input
            placeholder="请输入运单号"
            style={{ width: 400 }}
            value={trackingNumber}
            onChange={e => {
              dispatch({
                type: 'orderList/setData',
                payload: {
                  key: 'trackingNumber',
                  value: e.target.value,
                },
              });
            }}
          />
        </FormRow>
      </Modal>

      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={orderList.noticeInfo}
        visible={orderList.noticeVisible}
        namespace="orderList"
      />
    </Card>
  );
};

export default connect(({ orderList, loading }) => ({ orderList, loading }))(OrderList);
