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
  const { gmtStart, gmtEnd, soldRankDetailList } = soldRank;

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
    dataSource: soldRankDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['soldRank/getSoldRankDetailList'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onChange: pn => {
      dispatch({
        type: 'soldRank/save',
        payload: {
          current: pn.current,
          pageSize: pn.pageSize,
        },
      });

      dispatch({
        type: 'soldRank/getSoldRankDetailList',
      });
    },
  };

  return (
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
        info={soldRank.noticeInfo}
        visible={soldRank.noticeVisible}
        namespace="soldRank"
      />
    </Card>
  );
};

export default connect(({ soldRank, loading }) => ({ soldRank, loading }))(SoldRank);
