import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card } from 'antd';
import NoticeModal from '../NoticeModal';

const CommodityAdd = ({ dispatch, commodityAdd }) => {
  return (
    <Card>
      <Row>
        <Col span={24} />
      </Row>
      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={commodityAdd.noticeInfo}
        visible={commodityAdd.noticeVisible}
        namespace="commodityAdd"
      />
    </Card>
  );
};

export default Form.create()(
  connect(({ commodityAdd, loading }) => ({ commodityAdd, loading }))(CommodityAdd)
);
