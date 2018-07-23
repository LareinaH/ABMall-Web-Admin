import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Row, Col, DatePicker, Spin } from 'antd';

import { DataSet } from '@antv/data-set';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, Guide } from 'bizcharts';
import NoticeModal from '../NoticeModal';
import FormLabel from '../../components/MyComponent/FormLabel';

const { RangePicker } = DatePicker;

const OrderStat = ({ dispatch, loading, orderStat }) => {
  const { gmtStart, gmtEnd, data } = orderStat;

  const onDaysRangeChange = dateArray => {
    dispatch({
      type: 'orderStat/setDatas',
      payload: [{ key: 'gmtStart', value: dateArray[0] }, { key: 'gmtEnd', value: dateArray[1] }],
    });

    dispatch({
      type: 'orderStat/getOrderStatusStats',
    });
  };

  const { DataView } = DataSet;
  const { Html } = Guide;
  const dv = new DataView();
  dv.source(data).transform({
    type: 'percent',
    field: 'sum',
    dimension: 'orderStatus',
    as: 'percent',
  });
  const cols = {
    percent: {
      formatter: val => {
        return `${val * 100}%`;
      },
    },
  };

  const sum = data
    .map(x => x.sum)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const centerHtml = `<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">订单<br><span style="color:#262626;font-size:2.5em">${sum}</span>个</div>`;

  return (
    <Card>
      <Row>
        <Col span={24}>
          <FormLabel label="请选择时间" />
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['开始时间', '结束时间']}
            allowClear={false}
            value={[gmtStart, gmtEnd]}
            ranges={{
              今天: [moment().startOf('day'), moment().endOf('day')],
              本周: [moment().startOf('week'), moment().endOf('week')],
              本月: [moment().startOf('month'), moment().endOf('month')],
              本季度: [moment().startOf('quarter'), moment().endOf('quarter')],
              本年: [moment().startOf('year'), moment().endOf('year')],
            }}
            onOk={onDaysRangeChange}
            onChange={onDaysRangeChange}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          {loading.effects['orderStat/getOrderStatusStats'] ? (
            <Spin tip="正在查询订单统计数据..." />
          ) : (
            <Chart height={500} data={dv} scale={cols} padding={[80, 100, 80, 80]} forceFit>
              <Coord type="theta" radius={1} innerRadius={0.9} />
              <Axis name="percent" />
              <Legend position="bottom" />
              <Tooltip
                showTitle
                itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
              />
              <Guide>
                <Html position={['50%', '50%']} html={centerHtml} alignX="middle" alignY="middle" />
              </Guide>
              <Geom
                type="intervalStack"
                position="percent"
                color="orderStatus"
                tooltip={[
                  'orderStatus*percent',
                  (orderStatus, percent) => {
                    return {
                      title: `共计${sum * percent}`,
                      name: orderStatus,
                      value: `${Number.parseFloat(percent).toFixed(2) * 100}%`,
                    };
                  },
                ]}
                style={{ lineWidth: 1, stroke: '#fff' }}
              >
                <Label
                  content="percent"
                  formatter={(val, item) => {
                    return `${item.point.orderStatus}:${Number.parseFloat(val).toFixed(2)}%`;
                  }}
                />
              </Geom>
            </Chart>
          )}
        </Col>
      </Row>

      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={orderStat.noticeInfo}
        visible={orderStat.noticeVisible}
        namespace="orderStat"
      />
    </Card>
  );
};

export default connect(({ orderStat, loading }) => ({ orderStat, loading }))(OrderStat);
