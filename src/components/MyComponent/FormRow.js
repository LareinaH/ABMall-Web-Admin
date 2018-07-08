import React from 'react';
import { Row, Col } from 'antd';

const FormRow = ({ label, labelSpan, children, contentSpan }) => {
  return (
    <Row>
      <Col span={labelSpan} style={{ textAlign: 'right' }}>
        <span style={{ paddingRight: 8, width: 100, lineHeight: '32px', textAlign: 'right' }}>
          <span style={{ paddingRight: 4, color: 'red', fontFamily: 'SimSun' }}>*</span>
          {label}:
        </span>
      </Col>
      <Col span={contentSpan}>{children}</Col>
    </Row>
  );
};

export default FormRow;
