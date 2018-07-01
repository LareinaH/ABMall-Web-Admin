/* eslint-disable no-param-reassign,no-console,react/no-array-index-key */
import React from 'react';
import OSS from 'ali-oss';
import co from 'co';
import { Button, Upload, Tooltip, Icon, Spin } from 'antd';
import config from '../../utils/config';

const PicUpload = ({
  picList,
  picWidth,
  picHeight,
  buttonRowHeight,
  onUpdateAdItemUrl, // 更新上传项回调函数
  onDeleteAdItem, // 更新上传项回调函数
  onChangeUploadingStatus, // 更新上传状态
  ossDirectoryPrefix, // oss的目录前缀
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      {picList &&
        picList.map((adItem, index) => {
          const { adUrl: oldAdUrl, uploading } = adItem;

          const uploadProps = {
            showUploadList: false,
            beforeUpload: file => {
              const { OSS_CONFIG, OSS_PREFIX } = config;
              const ossClient = new OSS({ ...OSS_CONFIG });
              const { name, uid } = file;
              const fileKey = `${uid}-${name}`;
              const objectKey = OSS_PREFIX + ossDirectoryPrefix + fileKey;
              // eslint-disable-next-line func-names
              co(function*() {
                onChangeUploadingStatus(index, true);
                yield ossClient.multipartUpload(objectKey, file, {
                  mime: 'image/jpeg',
                });

                const newAdUrl = `https://${OSS_CONFIG.bucket}.${
                  OSS_CONFIG.region
                }.aliyuncs.com/${objectKey}`;
                onChangeUploadingStatus(index, false);
                onUpdateAdItemUrl(index, newAdUrl, oldAdUrl);
              }).catch(err => {
                console.log(err);
              });
              return false;
            },
          };
          return (
            <div key={index} style={{ marginRight: 8 }}>
              {oldAdUrl ? (
                uploading ? (
                  <div
                    style={{
                      width: picWidth,
                      height: picHeight,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Spin tip="图片上传中" />
                  </div>
                ) : (
                  <div>
                    <div>
                      <Tooltip title="请点击下方上传按钮上传图片">
                        <img
                          style={{ width: picWidth, height: picHeight }}
                          alt="请点击下方上传按钮上传图片"
                          src={oldAdUrl}
                        />
                      </Tooltip>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        width: picWidth,
                        height: buttonRowHeight,
                      }}
                    >
                      <Upload {...uploadProps}>
                        <Button size="small" type="primary" icon="upload" disabled={uploading}>
                          上传
                        </Button>
                      </Upload>
                      <Button
                        size="small"
                        type="danger"
                        icon="delete"
                        disabled={uploading}
                        onClick={onDeleteAdItem.bind(null, index)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                )
              ) : uploading ? (
                <div
                  style={{
                    width: picWidth,
                    height: picHeight + buttonRowHeight,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spin tip="图片上传中" />
                </div>
              ) : (
                <div>
                  <Upload {...uploadProps}>
                    <Button
                      style={{ width: picWidth, height: picHeight + buttonRowHeight }}
                      type="dashed"
                      loading={uploading}
                    >
                      <Icon type="plus" /> 添加图片
                    </Button>
                  </Upload>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default PicUpload;
