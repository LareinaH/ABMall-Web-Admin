/* eslint-disable react/no-array-index-key */
import React from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Divider, Popconfirm, Table, Row, Col, Card, Tag } from 'antd';
import { pagination } from '../../common/tablePageProps';
import { addAlignForColumns } from '../../utils/utils';
import NoticeModal from '../NoticeModal';

const NoticeList = ({ dispatch, loading, noticeList }) => {
  const { current, pageSize, total } = noticeList;
  const { noticeDetailList, levelList } = noticeList;

  const onDeleteNotice = id => {
    dispatch({
      type: 'noticeList/deleteNotice',
      payload: id,
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '通知名称',
      dataIndex: 'title',
    },
    {
      title: '重要紧急性',
      render: (text, record) => {
        const levelName = levelList
          .filter(x => x.value === record.level)
          .map(x => x.label)
          .join(',');
        if (levelName) {
          return levelName;
        } else {
          return record.level;
        }
      },
    },
    {
      title: '是否显示',
      dataIndex: 'isOnSell',
      render: text => {
        if (text) {
          return <Tag color="#87d068">是</Tag>;
        } else {
          return <Tag color="#f50">否</Tag>;
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmtPublish',
    },
    {
      title: '操作',
      render: (text, record) => (
        <div>
          <a
            target="_blank"
            href={`/platformNotice/noticeAdd?${stringify({
              id: record.id,
            })}`}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除通知后,此条通知无法恢复,您确定删除此通知么?"
            onConfirm={onDeleteNotice.bind(null, record.id)}
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
    dataSource: noticeDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['noticeList/getNoticeListPage'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onChange: pn => {
      dispatch({
        type: 'noticeList/setDatas',
        payload: [{ key: 'current', value: pn.current }, { key: 'pageSize', value: pn.pageSize }],
      });

      dispatch({
        type: 'noticeList/getNoticeListPage',
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
        info={noticeList.noticeInfo}
        visible={noticeList.noticeVisible}
        namespace="noticeList"
      />
    </div>
  );
};

export default connect(({ noticeList, loading }) => ({ noticeList, loading }))(NoticeList);
