import React from 'react';
import { Row, Col } from 'antd';

const FormRow = ({ label, labelSpan, children, contentSpan, visible }) => {
  // visible未设置时显示
  const displayStyle = {};
  if (visible === false) {
    Object.assign(displayStyle, {
      display: 'none',
    });
  }
  return (
    <Row style={displayStyle}>
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
