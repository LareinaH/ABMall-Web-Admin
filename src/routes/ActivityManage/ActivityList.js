/* eslint-disable react/no-array-index-key */
import React from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Divider, Popconfirm, Table, Row, Col, Card } from 'antd';
import { pagination } from '../../common/tablePageProps';
import { addAlignForColumns } from '../../utils/utils';
import NoticeModal from '../NoticeModal';

const ActivityList = ({ dispatch, loading, activityList }) => {
  const { current, pageSize, total } = activityList;
  const { activityDetailList } = activityList;

  const onDeleteActivity = id => {
    dispatch({
      type: 'activityList/deleteActivity',
      payload: id,
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
    },
    {
      title: '活动时间',
      render: () => {
        return '-';
      },
    },
    {
      title: '累计销售额度',
      render: () => {
        return '0';
      },
    },
    {
      title: '累计推广人数',
      render: () => {
        return '0';
      },
    },
    {
      title: '商品名称',
      render: () => {
        return '-';
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <div>
          <a
            target="_blank"
            href={`/activityManage/activityAdd?${stringify({
              id: record.id,
            })}`}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除活动后,此条活动无法恢复,您确定删除此活动么?"
            onConfirm={onDeleteActivity.bind(null, record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  addAlignForColumns(columns, 'center');

  const tableProps = {
    size: 'small',
    dataSource: activityDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['activityList/getActivityListPage'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onChange: pn => {
      dispatch({
        type: 'activityList/setDatas',
        payload: [{ key: 'current', value: pn.current }, { key: 'pageSize', value: pn.pageSize }],
      });

      dispatch({
        type: 'activityList/getActivityListPage',
      });
    },
  };

  return (
    <div>
      <Card>
        <Row>
          <Col span={24}>
            <Table {...tableProps} />
          </Col>
        </Row>
      </Card>
      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={activityList.noticeInfo}
        visible={activityList.noticeVisible}
        namespace="activityList"
      />
    </div>
  );
};

export default connect(({ activityList, loading }) => ({ activityList, loading }))(ActivityList);
