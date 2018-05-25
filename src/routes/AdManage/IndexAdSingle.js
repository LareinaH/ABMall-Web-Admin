import React from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Select } from 'antd';

const IndexAdSingle = ({ form, loading, title }) => {
  const { getFieldDecorator } = form;
  const FormItem = Form.Item;
  const { Option } = Select;
  return (
    <Card title={title} style={{ width: 350, float: 'left', marginRight: 24 }}>
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="点击上传广告图片"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <Button loading={loading.effects['indexAd/uploading']} type="primary" icon="save">
            保存
          </Button>,
          <Button type="primary" icon="save">
            重置
          </Button>,
        ]}
      >
        <FormItem label="广告链接">
          {getFieldDecorator('adUrl', {
            rules: [
              {
                required: true,
                message: '请填写广告链接',
              },
            ],
          })(<Input placeholder="请填写广告链接" />)}
        </FormItem>
        <FormItem label="选择商品">
          {getFieldDecorator('adGoods', {
            rules: [
              {
                required: true,
                message: '选择商品',
              },
            ],
          })(
            <Select placeholder="请选择商品" style={{ width: '100%' }}>
              <Option value="rmb">商品名称1</Option>
              <Option value="dollar">商品名称2</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="选择文章">
          {getFieldDecorator('adArticle', {
            rules: [
              {
                required: true,
                message: '请选择文章',
              },
            ],
          })(
            <Select placeholder="请选择文章" style={{ width: '100%' }}>
              <Option value="rmb">图文消息1</Option>
              <Option value="dollar">图文消息2</Option>
            </Select>
          )}
        </FormItem>
      </Card>
    </Card>
  );
};

export default Form.create()(connect(({ loading }) => ({ loading }))(IndexAdSingle));
