/* eslint-disable react/no-array-index-key */
import React from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Divider, Popconfirm, Table, Row, Col, Card } from 'antd';
import { pagination } from '../../common/tablePageProps';
import { addAlignForColumns } from '../../utils/utils';
import NoticeModal from '../NoticeModal';

const CommodityList = ({ dispatch, loading, commodityList }) => {
  const { categoryList, goodsDetailList } = commodityList;
  const { current, pageSize, total } = commodityList;

  const onDeleteGoods = id => {
    dispatch({
      type: 'commodityList/deleteGoods',
      payload: id,
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '销售价格',
      dataIndex: 'preferentialPrice',
    },
    {
      title: '是否上架',
      dataIndex: 'isOnSell',
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '分类',
      render: (text, record) => {
        const groupName = categoryList
          .filter(x => x.id === record.groupId)
          .map(x => x.goodsGroupName)
          .join(',');
        if (groupName) {
          return groupName;
        } else {
          return record.groupId;
        }
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <div>
          <a
            target="_blank"
            href={`/commodityManage/commodityAdd?${stringify({
              goodsId: record.id,
            })}`}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除商品后,原有商品无法恢复,您确定删除此商品吗?"
            onConfirm={onDeleteGoods.bind(null, record.id)}
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
    dataSource: goodsDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['commodityList/getGoodsListPage'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onChange: pn => {
      dispatch({
        type: 'commodityList/setDatas',
        payload: [{ key: 'current', value: pn.current }, { key: 'pageSize', value: pn.pageSize }],
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
        info={commodityList.noticeInfo}
        visible={commodityList.noticeVisible}
        namespace="commodityList"
      />
    </div>
  );
};

export default connect(({ commodityList, loading }) => ({ commodityList, loading }))(CommodityList);
