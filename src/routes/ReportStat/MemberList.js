import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Row, Col, DatePicker, Select, Input, Button, Table } from 'antd';
import NoticeModal from '../NoticeModal';
import FormRow from '../../components/MyComponent/FormRow';

import { addAlignForColumns } from '../../utils/utils';
import { pagination } from '../../common/tablePageProps';

const { RangePicker } = DatePicker;
const { Search } = Input;

const MemberList = ({ dispatch, loading, memberList }) => {
  const { name, phoneNum, level, gmtStart, gmtEnd, memberLevelList, memberDetailList } = memberList;

  const { current, pageSize, total } = memberList;

  const onDaysRangeChange = dateArray => {
    dispatch({
      type: 'memberList/save',
      payload: {
        gmtStart: dateArray[0],
        gmtEnd: dateArray[1],
        current: 1,
      },
    });

    dispatch({
      type: 'memberList/getMemberList',
    });
  };

  const onMemberListSearchChange = value => {
    dispatch({
      type: 'memberList/save',
      payload: {
        level: value,
        current: 1,
      },
    });

    dispatch({
      type: 'memberList/getMemberList',
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      fixed: 'left',
      width: 75,
    },
    {
      title: '会员昵称',
      dataIndex: 'name',
      fixed: 'left',
      width: 150,
    },
    {
      title: '注册时间',
      dataIndex: 'gmtCreate',
      fixed: 'left',
      width: 125,
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
      title: '引荐人昵称',
      dataIndex: 'referrerName',
      width: 150,
    },
    {
      title: '会员级别',
      width: 100,
      render: (text, record) => {
        return memberLevelList
          .filter(x => x.value === record.level)
          .map(x => x.label)
          .join(',');
      },
    },
    {
      title: '手机号',
      dataIndex: 'phoneNum',
      width: 125,
    },
    {
      title: '名下各级别数目',
      children: [
        {
          title: '团队中V3数目',
          dataIndex: 'teamV3Count',
          width: 150,
          align: 'center',
        },
        {
          title: '团队中V2数目',
          dataIndex: 'teamV2Count',
          width: 150,
          align: 'center',
        },
        {
          title: '团队中V1数目',
          dataIndex: 'teamV1Count',
          width: 150,
          align: 'center',
        },
        {
          title: '团队中代言人数目',
          dataIndex: 'teamAgentCount',
          width: 150,
          align: 'center',
        },
        {
          title: '团队中小白数目',
          dataIndex: 'teamWhiteCount',
          width: 150,
          align: 'center',
        },
      ],
    },
    {
      title: '直推人数',
      dataIndex: 'referTotalAgentCount',
      width: 150,
    },
    {
      title: '名下团队人数',
      dataIndex: 'referTotalCount',
      width: 150,
    },
    {
      title: '总购物金额',
      dataIndex: 'moneyTotalSpend',
      width: 100,
    },
    {
      title: '有效订单数目',
      dataIndex: 'ordersCount',
      width: 100,
    },
    {
      title: '返利总金额',
      dataIndex: 'moneyTotalEarn',
      width: 100,
    },
  ];

  addAlignForColumns(columns, 'center');

  const tableProps = {
    dataSource: memberDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['memberList/getMemberList'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onChange: pn => {
      dispatch({
        type: 'memberList/save',
        payload: {
          current: pn.current,
          pageSize: pn.pageSize,
        },
      });

      dispatch({
        type: 'memberList/getMemberList',
      });
    },
    scroll: { x: 2000 },
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
      <FormRow label="会员级别" labelSpan={2} contentSpan={8}>
        <Select
          allowClear
          placeholder="请选择会员级别"
          value={level}
          onChange={onMemberListSearchChange}
          style={{ width: 300 }}
        >
          {memberLevelList.map(item => (
            <Select.Option key={item.value}>{item.label}</Select.Option>
          ))}
        </Select>
      </FormRow>
      <FormRow label="会员昵称" labelSpan={2} contentSpan={8}>
        <Search
          placeholder="按会员昵称查询"
          onSearch={() => {
            dispatch({
              type: 'memberList/save',
              payload: {
                current: 1,
              },
            });

            dispatch({
              type: 'memberList/getMemberList',
            });
          }}
          enterButton
          style={{ width: 300 }}
          value={name}
          onChange={e => {
            dispatch({
              type: 'memberList/save',
              payload: {
                name: e.target.value,
              },
            });
          }}
        />
      </FormRow>
      <FormRow label="联系电话" labelSpan={2} contentSpan={16}>
        <div>
          <Search
            placeholder="按联系电话查询"
            onSearch={() => {
              dispatch({
                type: 'memberList/save',
                payload: {
                  current: 1,
                },
              });

              dispatch({
                type: 'memberList/getMemberList',
              });
            }}
            enterButton
            style={{ width: 300 }}
            value={phoneNum}
            onChange={e => {
              dispatch({
                type: 'memberList/save',
                payload: {
                  phoneNum: e.target.value,
                },
              });
            }}
          />
          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            icon="close"
            loading={loading.effects['memberList/getMemberList']}
            onClick={() => {
              dispatch({
                type: 'memberList/save',
                payload: {
                  gmtStart: moment().startOf('month'),
                  gmtEnd: moment().endOf('month'),
                  phoneNum: undefined,
                  level: undefined,
                  name: undefined,
                  current: 1,
                  pageSize: 10,
                },
              });

              dispatch({
                type: 'memberList/getMemberList',
              });
            }}
          >
            重置查询条件
          </Button>
        </div>
      </FormRow>

      <Row>
        <Col span={24}>
          <Table {...tableProps} />
        </Col>
      </Row>

      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={memberList.noticeInfo}
        visible={memberList.noticeVisible}
        namespace="memberList"
      />
    </Card>
  );
};

export default connect(({ memberList, loading }) => ({ memberList, loading }))(MemberList);
