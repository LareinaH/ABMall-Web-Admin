import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Row, Col, DatePicker, Table } from 'antd';
import NoticeModal from '../NoticeModal';
import FormRow from '../../components/MyComponent/FormRow';

import { addAlignForColumns } from '../../utils/utils';
import { pagination } from '../../common/tablePageProps';

const { RangePicker } = DatePicker;

const SoldRank = ({ dispatch, loading, soldRank }) => {
  const { gmtStart, gmtEnd, soldRankDetailList, order, columnKey } = soldRank;

  const { current, pageSize, total } = soldRank;

  const onDaysRangeChange = dateArray => {
    dispatch({
      type: 'soldRank/save',
      payload: {
        gmtStart: dateArray[0],
        gmtEnd: dateArray[1],
        current: 1,
      },
    });

    dispatch({
      type: 'soldRank/getSoldRankDetailList',
    });
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'good_name',
    },
    {
      title: '商品编号',
      dataIndex: 'goods_specification_no',
    },
    {
      title: '销售价格',
      dataIndex: 'good_price',
    },
    {
      title: '规格',
      dataIndex: 'goods_specification_name',
    },
    {
      title: '订单数量',
      dataIndex: 'order_count',
      sortOrder: columnKey === 'order_count' && order,
      sorter: true,
    },
    {
      title: '总销售额',
      dataIndex: 'total_money',
      sortOrder: columnKey === 'total_money' && order,
      sorter: true,
    },
    {
      title: '返利总额',
      dataIndex: 'rebate_money',
    },
  ];

  addAlignForColumns(columns, 'center');

  const tableProps = {
    dataSource: soldRankDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['soldRank/getSoldRankDetailList'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onChange: (pn, filters, sorter) => {
      const { order: od, columnKey: ck } = sorter;
      dispatch({
        type: 'soldRank/save',
        payload: {
          current: pn.current,
          pageSize: pn.pageSize,
          order: od,
          columnKey: ck,
        },
      });

      dispatch({
        type: 'soldRank/getSoldRankDetailList',
      });
    },
  };

  return (
    <Card>
      <FormRow label="时间段" labelSpan={1} contentSpan={8}>
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
        info={soldRank.noticeInfo}
        visible={soldRank.noticeVisible}
        namespace="soldRank"
      />
    </Card>
  );
};

export default connect(({ soldRank, loading }) => ({ soldRank, loading }))(SoldRank);
