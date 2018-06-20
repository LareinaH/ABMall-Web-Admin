import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Table, Button, Popconfirm, Input, Modal, Card, Divider } from 'antd';
import NoticeModal from '../NoticeModal';

const CategoryManage = ({
  dispatch,
  loading,
  categoryManage,
  form: { getFieldDecorator, validateFields },
}) => {
  const FormItem = Form.Item;
  const onDeleteCategory = id => {
    dispatch({
      type: 'categoryManage/deleteCategory',
      payload: id,
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '分类名称',
      dataIndex: 'goodsGroupName',
    },
    {
      title: '所含商品数',
      render: () => <span>0</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '操作',
      render: (text, record) => (
        <div>
          <a
            onClick={() => {
              dispatch({
                type: 'categoryManage/setDatas',
                payload: [
                  { key: 'showUpdateCategory', value: true },
                  { key: 'currentEditCategory', value: record },
                ],
              });
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除分类名称后，原有分类下的商品归类为空，您确定删除此分类名称么？"
            onConfirm={onDeleteCategory.bind(null, record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const showTotal = total => {
    return `共 ${total} 条数据`;
  };

  const tableProps = {
    dataSource: categoryManage.categoryListData,
    columns,
    rowKey: 'id',
    loading: loading.effects['categoryManage/getCategoryList'],
    // size: 'small',
    pagination: {
      size: 'small',
      showTotal,
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 10,
    },
  };

  const onAddOk = () => {
    validateFields(['categoryName'], (err, values) => {
      if (!err) {
        dispatch({
          type: 'categoryManage/addCategory',
          payload: values,
        });
      }
    });
  };

  const onAddCancel = () => {
    dispatch({
      type: 'categoryManage/setDatas',
      payload: [{ key: 'showAddCategory', value: false }],
    });
  };

  const onEditOk = () => {
    validateFields(['newCategoryName'], (err, values) => {
      if (!err) {
        dispatch({
          type: 'categoryManage/updateCategory',
          payload: values,
        });
      }
    });
  };
  const onEditCancel = () => {
    dispatch({
      type: 'categoryManage/setDatas',
      payload: [{ key: 'showUpdateCategory', value: false }],
    });
  };

  return (
    <Card>
      <Row>
        <Col span={24}>
          <Button
            type="primary"
            icon="plus-circle-o"
            onClick={() => {
              dispatch({
                type: 'categoryManage/setDatas',
                payload: [
                  {
                    key: 'showAddCategory',
                    value: true,
                  },
                ],
              });
            }}
          >
            添加分类
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table {...tableProps} />
        </Col>
      </Row>
      <Modal
        title="添加分类"
        visible={categoryManage.showAddCategory}
        onCancel={onAddCancel}
        destroyOnClose
        footer={[
          <Button key="取消" onClick={onAddCancel}>
            取消
          </Button>,
          <Button
            key="确认"
            type="primary"
            loading={loading.effects['categoryManage/addCategory']}
            onClick={onAddOk}
          >
            确认
          </Button>,
        ]}
      >
        <Form layout="inline">
          <FormItem label="分类名称">
            {getFieldDecorator('categoryName', {
              rules: [
                {
                  required: true,
                  message: '请填写分类名称',
                  max: 32,
                },
              ],
              initialValue: '',
              hasFeedback: true,
            })(<Input width="100%" placeholder="请填写分类名称" />)}
          </FormItem>
        </Form>
      </Modal>
      <Modal
        title="编辑分类"
        visible={categoryManage.showUpdateCategory}
        onCancel={onEditCancel}
        destroyOnClose
        footer={[
          <Button key="取消" onClick={onEditCancel}>
            取消
          </Button>,
          <Button
            key="确认"
            type="primary"
            loading={loading.effects['categoryManage/updateCategory']}
            onClick={onEditOk}
          >
            确认
          </Button>,
        ]}
      >
        <Form layout="inline">
          <FormItem label="原来名称">
            {getFieldDecorator('oldCategoryName', {
              rules: [
                {
                  required: true,
                  message: '请填写分类名称',
                  max: 32,
                },
              ],
              initialValue: categoryManage.currentEditCategory
                ? categoryManage.currentEditCategory.goodsGroupName
                : '',
              hasFeedback: true,
            })(<Input disabled width="100%" placeholder="请填写分类名称" />)}
          </FormItem>
          <FormItem label="分类名称">
            {getFieldDecorator('newCategoryName', {
              rules: [
                {
                  required: true,
                  message: '请填写分类名称',
                },
              ],
              initialValue: '',
            })(<Input width="100%" placeholder="请填写分类名称" />)}
          </FormItem>
        </Form>
      </Modal>
      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={categoryManage.noticeInfo}
        visible={categoryManage.noticeVisible}
        namespace="categoryManage"
      />
    </Card>
  );
};

export default Form.create()(
  connect(({ categoryManage, loading }) => ({ categoryManage, loading }))(CategoryManage)
);
