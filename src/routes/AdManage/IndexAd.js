import React from 'react';
import { connect } from 'dva';
import { Card, Button, Avatar } from 'antd'

const { Meta } = Card;

const IndexAd = () => {
  const title1 = '第一个广告图'
  return (
    <Card title={title1} style={{ width: 350 }}>
      <Card
        style={{ width: 300 }}
        cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
        actions={[<Button type="primary" icon="save">保存</Button>]}
      >
        <Meta
          title="Card title">
        </Meta>
      </Card>
    </Card>
  )
};

IndexAd.propTypes = {};

export default connect(({ loading }) => ({ loading }))(IndexAd);
