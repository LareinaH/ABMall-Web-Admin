/* eslint-disable no-param-reassign,no-console */
import React from 'react';
import OSS from 'ali-oss';
import co from 'co';
import { Card, Button, Upload } from 'antd';
import config from '../../utils/config';
import style from './style.less';

const InviteQRcodeSingle = ({ dispatch, loading, title, adItem, index }) => {
  const { adUrl, id, uploading } = adItem;
  const uploadProps = {
    listType: 'picture',
    showUploadList: false,
    beforeUpload: file => {
      console.log('upload file', file);
      console.log('upload file path is ', file.size, file.path);
      const { OSS_CONFIG, OSS_PREFIX } = config;
      const ossClient = new OSS({ ...OSS_CONFIG });
      console.log('ossClient is ', ossClient);
      const { name, uid } = file;
      const fileKey = `${uid}-${name}`;
      const objectKey = OSS_PREFIX + fileKey;
      // eslint-disable-next-line func-names
      co(function*() {
        adItem.uploading = true;
        dispatch({
          type: 'inviteQRcode/saveAdUrlLocal',
          payload: {
            adItem,
            index,
          },
        });
        const result = yield ossClient.multipartUpload(objectKey, file, {
          mime: 'image/jpeg',
        });
        console.log('upload result is ', result);

        adItem.adUrl = `https://${OSS_CONFIG.bucket}.${
          OSS_CONFIG.region
        }.aliyuncs.com/${objectKey}`;
        adItem.uploading = false;
        dispatch({
          type: 'inviteQRcode/saveAdUrlLocal',
          payload: {
            adItem,
            index,
          },
        });
      }).catch(err => {
        console.log(err);
      });
      return false;
    },
  };

  const saveAdUrl = () => {
    dispatch({
      type: 'inviteQRcode/saveAdUrl',
      payload: {
        adUrl,
        id,
      },
    });
  };

  return (
    <Card
      style={{ width: 250, float: 'left', marginRight: 24 }}
      hoverable
      cover={<img alt="暂未设置图片,请点击下方上传按钮" src={adUrl} />}
      actions={[
        <Upload {...uploadProps}>
          <Button type="primary" icon="upload" loading={uploading}>
            上传
          </Button>
        </Upload>,
        <Button
          type="primary"
          icon="save"
          loading={loading.effects['inviteQRcode/saveAdUrl']}
          onClick={saveAdUrl}
        >
          保存
        </Button>,
      ]}
    >
      <div className={style.cardWrapper}>
        <Card.Meta title={title} />
      </div>
    </Card>
  );
};

export default InviteQRcodeSingle;
