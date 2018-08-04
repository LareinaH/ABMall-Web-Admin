import React, { Fragment } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { connect } from 'dva';
import { Card, Row, Col, DatePicker, Table, Tooltip, Icon, Select } from 'antd';
import { Chart, Geom, Axis, Tooltip as BcTooltip } from 'bizcharts';
import { ChartCard } from 'components/Charts';
import Trend from 'components/Trend';
import NoticeModal from '../NoticeModal';
import FormRow from '../../components/MyComponent/FormRow';
import LoadingSpin from '../../components/MyComponent/LoadingSpin';

import { addAlignForColumns } from '../../utils/utils';
import { Yuan, colResponsivePropsFor4Columns } from '../../common/tablePageProps';
import styles from '../Dashboard/Analysis.less';

const { RangePicker } = DatePicker;

const SoldStat = ({ dispatch, loading, soldStat }) => {
  const {
    gmtStart,
    gmtEnd,
    soldStatDetailList,
    statInfo,
    salesMoneyTrend,
    year,
    yearList,
  } = soldStat;

  const {
    totalSalesMoney,
    lastMonthSalesMoney,
    lastlastMonthSalesMoney,
    yesterdaySalesMoney,
    totalOrdersCount,
  } = statInfo;

  const onDaysRangeChange = dateArray => {
    dispatch({
      type: 'soldStat/save',
      payload: {
        gmtStart: dateArray[0],
        gmtEnd: dateArray[1],
      },
    });

    dispatch({
      type: 'soldStat/getSalesMoneyTrend',
    });
  };

  const onYearChange = value => {
    dispatch({
      type: 'soldStat/save',
      payload: {
        year: value,
      },
    });

    dispatch({
      type: 'soldStat/getYearStat',
    });
  };

  const columns = [
    {
      title: '月份',
      dataIndex: 'month',
    },
    {
      title: '销售额',
      dataIndex: 'totalSoldMoney',
    },
    {
      title: '支付宝金额/单数',
      render: (text, record) => {
        return `${record.alipayTotalMoney}/${record.alipayTotalCount}笔`;
      },
    },
    {
      title: '微信金额/单数',
      render: (text, record) => {
        return `${record.wechatTotalMoney}/${record.wechatTotalCount}笔`;
      },
    },
    {
      title: '订单量',
      dataIndex: 'orderCount',
    },
    {
      title: '返利额',
      dataIndex: 'totalRebateMoney',
    },
  ];

  addAlignForColumns(columns, 'center');

  const cols = {
    totalMoney: {
      alias: '日销售额（元）',
    },
    histDay: {
      alias: '日期',
    },
  };

  const tableProps = {
    dataSource: soldStatDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['soldStat/getYearStat'],
    pagination: false,
  };

  return (
    <Fragment>
      <Card>
        <LoadingSpin
          isLoad={loading.effects['soldStat/getSalesMoneyStat']}
          tip="正在查询销售额统计信息..."
        >
          <Fragment>
            <Row gutter={24}>
              <Col {...colResponsivePropsFor4Columns}>
                <ChartCard
                  bordered
                  title="总销售额（元）"
                  action={
                    <Tooltip title="平台用户量">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={() => <Yuan>{totalSalesMoney}</Yuan>}
                  contentHeight={32}
                >
                  <div />
                </ChartCard>
              </Col>
              <Col {...colResponsivePropsFor4Columns}>
                <ChartCard
                  bordered
                  title="上月销售额（元）"
                  action={
                    <Tooltip title="上月销售额（元）">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={() => <Yuan>{lastMonthSalesMoney}</Yuan>}
                  contentHeight={32}
                >
                  {lastMonthSalesMoney - lastlastMonthSalesMoney > 0 ? (
                    <Trend flag="up" style={{ marginRight: 16 }}>
                      月环比
                      <span className={styles.trendText}>
                        {lastMonthSalesMoney - lastlastMonthSalesMoney}
                      </span>
                    </Trend>
                  ) : (
                    <Trend flag="down" style={{ marginRight: 16 }}>
                      月环比
                      <span className={styles.trendText}>
                        {lastlastMonthSalesMoney - lastMonthSalesMoney}
                      </span>
                    </Trend>
                  )}
                </ChartCard>
              </Col>
              <Col {...colResponsivePropsFor4Columns}>
                <ChartCard
                  bordered
                  title="昨日销售额（元）"
                  action={
                    <Tooltip title="昨日销售额（元）">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={() => <Yuan>{yesterdaySalesMoney}</Yuan>}
                  contentHeight={32}
                >
                  <div />
                </ChartCard>
              </Col>
              <Col {...colResponsivePropsFor4Columns}>
                <ChartCard
                  bordered
                  title="累计总销量"
                  action={
                    <Tooltip title="累计总销量">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={`${numeral(totalOrdersCount).format('0,0')} 单`}
                  contentHeight={32}
                >
                  <div />
                </ChartCard>
              </Col>
            </Row>
          </Fragment>
        </LoadingSpin>
      </Card>
      <Card style={{ marginTop: 8 }} title="销售额统计图">
        <FormRow label="时间段" labelSpan={1} contentSpan={8}>
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['开始时间', '结束时间']}
            allowClear={false}
            value={[gmtStart, gmtEnd]}
            ranges={{
              本周: [moment().startOf('week'), moment().endOf('week')],
              本月: [moment().startOf('month'), moment().endOf('month')],
              本季度: [moment().startOf('quarter'), moment().endOf('quarter')],
              本年: [moment().startOf('year'), moment().endOf('year')],
            }}
            onChange={onDaysRangeChange}
            style={{ width: 300 }}
          />
        </FormRow>
        <LoadingSpin
          isLoad={loading.effects['soldStat/getSalesMoneyStat']}
          tip="正在查询日销售额趋势统计信息..."
        >
          <Row>
            <Col span={24}>
              <Chart height={400} data={salesMoneyTrend} scale={cols} padding="auto" forceFit>
                <Axis name="totalMoney" title />
                <Axis name="histDay" title />
                <BcTooltip crosshairs={{ type: 'y' }} />
                <Geom type="line" position="histDay*totalMoney" size={2} />
                <Geom
                  type="point"
                  position="histDay*totalMoney"
                  size={4}
                  shape="circle"
                  style={{ stroke: '#fff', lineWidth: 1 }}
                />
              </Chart>
            </Col>
          </Row>
        </LoadingSpin>
      </Card>
      <Card style={{ marginTop: 8 }}>
        <FormRow label="选择年份" labelSpan={2} contentSpan={8}>
          <Select
            placeholder="请选择年份"
            value={year.toString()}
            onChange={onYearChange}
            style={{ width: 150 }}
          >
            {yearList.map(item => <Select.Option key={item}>{`${item}年`}</Select.Option>)}
          </Select>
        </FormRow>
        <Row>
          <Col span={24}>
            <Table {...tableProps} />
          </Col>
        </Row>
      </Card>

      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={soldStat.noticeInfo}
        visible={soldStat.noticeVisible}
        namespace="soldStat"
      />
    </Fragment>
  );
};

export default connect(({ soldStat, loading }) => ({ soldStat, loading }))(SoldStat);
