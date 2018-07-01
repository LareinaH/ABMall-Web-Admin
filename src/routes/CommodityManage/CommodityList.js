/* eslint-disable react/no-array-index-key */
import React from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Divider, Popconfirm, Table, Row, Col, Card, Tag } from 'antd';
import { pagination } from '../../common/tablePageProps';
import { addAlignForColumns } from '../../utils/utils';
import NoticeModal from '../NoticeModal';

const CommodityList = ({ dispatch, loading, commodityList }) => {
  const { categoryList, goodsDetailList, expandedRows } = commodityList;
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
    size: 'small',
    dataSource: goodsDetailList,
    columns,
    rowKey: 'id',
    loading: loading.effects['commodityList/getGoodsListPage'],
    pagination: Object.assign({}, pagination, {
      current,
      pageSize,
      total,
    }),
    onExpand: (expanded, record) => {
      if (expanded) {
        expandedRows.push(record.id);
        dispatch({
          type: 'commodityList/setDatas',
          payload: [{ key: 'expandedRows', value: expandedRows }],
        });
      } else {
        dispatch({
          type: 'commodityList/setDatas',
          payload: [{ key: 'expandedRows', value: expandedRows.filter(x => x !== record.id) }],
        });
      }
    },
    expandedRowKeys: expandedRows,
    onChange: pn => {
      dispatch({
        type: 'commodityList/setDatas',
        payload: [{ key: 'current', value: pn.current }, { key: 'pageSize', value: pn.pageSize }],
      });

      dispatch({
        type: 'commodityList/getGoodsListPage',
      });
    },
    expandedRowRender: record => {
      const { goodsSpecificationList } = record;
      const expandColumns = [
        {
          title: '商品规格',
          dataIndex: 'goodsSpecificationName',
        },
        {
          title: '商品编号',
          dataIndex: 'goodsSpecificationNo',
        },
        {
          title: '原价显示值',
          dataIndex: 'price',
        },
        {
          title: '销售价',
          dataIndex: 'preferentialPrice',
        },
        {
          title: '库存',
          dataIndex: 'stock',
        },
        {
          title: '上架',
          dataIndex: 'isOnSell',
          render: text => {
            if (text) {
              return <Tag color="#87d068">是</Tag>;
            } else {
              return <Tag color="#f50">否</Tag>;
            }
          },
        },
      ];

      addAlignForColumns(expandColumns, 'center');

      const expandTableProps = {
        size: 'small',
        dataSource: goodsSpecificationList,
        columns: expandColumns,
        rowKey: 'id',
        pagination: false,
      };

      return <Table {...expandTableProps} />;
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
