/* eslint-disable react/no-array-index-key */
import React from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Popconfirm, Table, Row, Col, Card, Badge, Divider } from 'antd';
import { pagination } from '../../common/tablePageProps';
import { addAlignForColumns } from '../../utils/utils';
import NoticeModal from '../NoticeModal';

const StudyList = ({ dispatch, loading, studyList }) => {
  const { current, pageSize, total } = studyList;
  const { studyDetailList } = studyList;

  const onUpdateStatus = (status, id) => {
    dispatch({
      type: 'studyList/updateStatus',
      payload: {
        id,
        status,
      },
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '课程名称',
      dataIndex: 'title',
    },
    {
      title: '课程简介',
      dataIndex: 'brief',
    },
    {
      title: '课程图片',
      dataIndex: 'adsUrl',
      render: text => {
        if (text) {
          return text.split(',').map((x, index) => {
            return <img key={index} alt={index} style={{ width: 140, height: 160 }} src={x} />;
          });
        }

        return text;
      },
    },
    {
      title: '状态',
      dataIndex: 'messageStatus',
      render: text => {
        if (text === 'WAIT_PUBLISH') {
          return <Badge status="warning" text="待发布" />;
        } else if (text === 'PUBLISHED') {
          return <Badge status="success" text="已发布" />;
        } else if (text === 'FINISH') {
          return <Badge status="default" text="结束发布" />;
        } else {
          return text;
        }
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        if (record.messageStatus === 'WAIT_PUBLISH' || record.messageStatus === 'FINISH') {
          return (
            <div>
              <a
                target="_blank"
                href={`/contentStudy/studyAdd?${stringify({
                  id: record.id,
                })}`}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定发布?"
                onConfirm={onUpdateStatus.bind(null, 'PUBLISHED', record.id)}
                okText="确定"
                cancelText="取消"
              >
                <a>发布</a>
              </Popconfirm>
            </div>
          );
        } else if (record.messageStatus === 'PUBLISHED') {
          return (
            <div>
              <a
                target="_blank"
                href={`/contentStudy/studyAdd?${stringify({
                  id: record.id,
                })}`}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定取消发布?"
                onConfirm={onUpdateStatus.bind(null, 'FINISH', record.id)}
                okText="确定"
                cancelText="取消"
              >
                <a>取消发布</a>
              </Popconfirm>
            </div>
          );
        }
      },
    },
  ];

  addAlignForColumns(columns, 'center');

  const tableProps = {
    // size: 'small',
    dataSource: studyDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['studyList/getStudyListPage'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onChange: pn => {
      dispatch({
        type: 'studyList/setDatas',
        payload: [{ key: 'current', value: pn.current }, { key: 'pageSize', value: pn.pageSize }],
      });

      dispatch({
        type: 'studyList/getStudyListPage',
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
        info={studyList.noticeInfo}
        visible={studyList.noticeVisible}
        namespace="studyList"
      />
    </div>
  );
};

export default connect(({ studyList, loading }) => ({ studyList, loading }))(StudyList);
