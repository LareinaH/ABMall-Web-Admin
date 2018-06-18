import React from 'react';
import { Card, Button, Upload, message } from 'antd';

const InviteQRcodeSingle = ({ title, imageHref }) => {
  const uploadProps = {
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Card title={title} style={{ width: 350, float: 'left', marginRight: 24 }}>
      <Card
        style={{ width: 300 }}
        hoverable
        cover={<img alt="点击上传广告图片" src={imageHref} />}
        actions={[
          <Upload {...uploadProps}>
            <Button type="primary" icon="upload">
              上传
            </Button>
          </Upload>,
          <Button type="primary" icon="save">
            保存
          </Button>,
        ]}
      />
    </Card>
  );
};

export default InviteQRcodeSingle;
