import React from 'react';
import { Row, Col, Spin } from 'antd';

const LoadingSpin = ({ isLoad, tip, children }) => {
  if (isLoad) {
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Spin tip={tip} />
        </Col>
      </Row>
    );
  } else {
    return children;
  }
};

export default LoadingSpin;
