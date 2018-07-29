import React, { Fragment } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { connect } from 'dva';
import { Card, Row, Col, DatePicker, Table, Spin, Tooltip, Icon } from 'antd';
import { ChartCard } from 'components/Charts';
import Trend from 'components/Trend';
import NoticeModal from '../NoticeModal';
import FormRow from '../../components/MyComponent/FormRow';

import { addAlignForColumns } from '../../utils/utils';
import { pagination, Yuan, colResponsivePropsFor4Columns } from '../../common/tablePageProps';
import styles from '../Dashboard/Analysis.less';

const { RangePicker } = DatePicker;

const SoldStat = ({ dispatch, loading, soldStat }) => {
  const { gmtStart, gmtEnd, soldStatDetailList } = soldStat;

  const { current, pageSize, total } = soldStat;

  const onDaysRangeChange = dateArray => {
    dispatch({
      type: 'soldStat/save',
      payload: {
        gmtStart: dateArray[0],
        gmtEnd: dateArray[1],
        current: 1,
      },
    });

    dispatch({
      type: 'soldStat/getSoldStatDetailList',
    });
  };

  const columns = [
    {
      title: '排行',
      dataIndex: 'rankingId',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品编号',
      dataIndex: 'gmtCreate',
    },
    {
      title: '销售价格',
      dataIndex: 'gmtCreate',
    },
    {
      title: '分类',
      dataIndex: 'gmtCreate',
    },
    {
      title: '规格',
      dataIndex: 'gmtCreate',
    },
    {
      title: '订单数量',
      dataIndex: 'referrerName',
    },
    {
      title: '总销售额',
      dataIndex: 'referrerName',
    },
    {
      title: '返利总额',
      dataIndex: 'phoneNum',
    },
  ];

  addAlignForColumns(columns, 'center');

  const tableProps = {
    dataSource: soldStatDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['soldStat/getSoldStatDetailList'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onChange: pn => {
      dispatch({
        type: 'soldStat/save',
        payload: {
          current: pn.current,
          pageSize: pn.pageSize,
        },
      });

      dispatch({
        type: 'soldStat/getSoldStatDetailList',
      });
    },
  };

  return (
    <Fragment>
      <Card>
        {loading.effects['soldStat/get'] ? (
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Spin tip="正在查询销售额统计信息..." />
            </Col>
          </Row>
        ) : (
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
                  total={() => <Yuan>126560</Yuan>}
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
                  total={() => <Yuan>126560</Yuan>}
                  contentHeight={32}
                >
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    月同比<span className={styles.trendText}>12%</span>
                  </Trend>
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
                  total={() => <Yuan>126560</Yuan>}
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
                  total={`${numeral(6560).format('0,0')} 单`}
                  contentHeight={32}
                >
                  <div />
                </ChartCard>
              </Col>
            </Row>
          </Fragment>
        )}
      </Card>
      <Card>
        <FormRow label="时间段" labelSpan={2} contentSpan={8}>
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
            onChange={onDaysRangeChange}
            style={{ width: 300 }}
          />
        </FormRow>

        <Row>
          <Col span={24}>
            <Table {...tableProps} />
          </Col>
        </Row>

        <NoticeModal
          title="注意"
          dispatch={dispatch}
          info={soldStat.noticeInfo}
          visible={soldStat.noticeVisible}
          namespace="soldStat"
        />
      </Card>
    </Fragment>
  );
};

export default connect(({ soldStat, loading }) => ({ soldStat, loading }))(SoldStat);
