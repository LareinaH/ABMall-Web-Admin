import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Row, Col, DatePicker, Select, Input, Button, Table, Alert } from 'antd';
import NoticeModal from '../NoticeModal';

const { RangePicker } = DatePicker;
const { Search } = Input;

const OrderList = ({ dispatch, loading, orderList }) => {
  const { dateStart, dateEnd, daysRange } = orderList;
  const {
    orderStatus,
    orderStatusMapList,
    returnsStatus,
    returnsStatusMapList,
    searchOrderId,
  } = orderList;
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
      payload: [{ key: 'orderStatus', value }],
    });

    dispatch({
      type: 'orderList/getOrderList',
    });
  };
  const onReturnsStatusChange = value => {
    dispatch({
      type: 'orderList/setDatas',
      payload: [{ key: 'returnsStatus', value }],
    });

    dispatch({
      type: 'orderList/getOrderList',
    });
  };

  const onDaysSelectChange = value => {
    dispatch({
      type: 'orderList/setDatas',
      payload: [{ key: 'daysRange', value }],
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
    },
    {
      title: '订单来源',
      dataIndex: 'orderSource',
    },
    {
      title: '收件联系方式',
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
      title: '实付金额',
      dataIndex: 'totalMoney',
    },
    {
      title: '总返利金额',
      dataIndex: 'rebateMoney',
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
    },
    {
      title: '快递单号',
      dataIndex: 'logisticCode',
    },
    {
      title: '退/补货状态',
      dataIndex: 'returnStatus',
    },
    {
      title: '订单变更时间',
      dataIndex: 'gmtModify',
    },
    {
      title: '订单会员手机号',
      dataIndex: 'memberPhone',
    },
    {
      title: '操作',
      render: () => (
        <div>
          <a>编辑</a>
        </div>
      ),
    },
  ];

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
      size: 'small',
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
    },
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
