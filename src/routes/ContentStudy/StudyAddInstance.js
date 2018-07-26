import React, { PureComponent } from 'react';
import OSS from 'ali-oss';
import co from 'co';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button } from 'antd';
import NoticeModal from '../NoticeModal';
import PicUpload from '../CommodityManage/PicUpload';
import FormLabel from '../../components/MyComponent/FormLabel';
import config from '../../utils/config';
import style from './index.less';

class StudyAddInstance extends PureComponent {
  constructor(props) {
    super(props);
    this.editorInstance = null;
  }

  setRef(ref) {
    this.editorInstance = ref;
  }

  render() {
    const { dispatch, loading, studyAdd } = this.props;
    const { id, title, brief, adsUrl, messageDetail } = studyAdd;

    const formProps = {
      span: 24,
      style: {
        display: 'flex',
      },
    };

    const { OSS_PREFIX_PLATFORM_NOTICE } = config;

    const props = {
      picList: adsUrl,
      picWidth: 140,
      picHeight: 160,
      buttonRowHeight: 40,
      ossDirectoryPrefix: OSS_PREFIX_PLATFORM_NOTICE,
      onChangeUploadingStatus: (outIndex, status) => {
        adsUrl[outIndex].uploading = status;

        dispatch({
          type: 'studyAdd/setData',
          payload: {
            key: 'adsUrl',
            value: adsUrl,
          },
        });
      },
      onUpdateAdItemUrl: (outIndex, newAdUrl, oldAdUrl) => {
        adsUrl[outIndex].adUrl = newAdUrl;

        // 限制只允许上传一张图片
        if (!oldAdUrl && adsUrl.length < 1) {
          adsUrl.push({
            adUrl: '',
            uploading: false,
          });
        }

        dispatch({
          type: 'studyAdd/setData',
          payload: {
            key: 'adsUrl',
            value: adsUrl,
          },
        });
      },
      onDeleteAdItem: outIndex => {
        adsUrl.splice(outIndex, 1);

        if (adsUrl.length <= 0) {
          adsUrl.push({
            adUrl: '',
            uploading: false,
          });
        }

        dispatch({
          type: 'studyAdd/setData',
          payload: {
            key: 'adsUrl',
            value: adsUrl,
          },
        });
      },
    };

    const buildPreviewHtml = () => {
      return `
      <!Doctype html>
      <html>
        <head>
          <title>内容预览</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
            <div class="container">${messageDetail}</div>
        </body>
      </html>
    `;
    };

    const preview = () => {
      if (window.previewWindow) {
        window.previewWindow.close();
      }
      window.previewWindow = window.open();
      window.previewWindow.document.write(buildPreviewHtml());
    };

    const editorProps = {
      height: 500,
      contentFormat: 'html',
      initialContent: messageDetail,
      excludeControls: ['emoji'],
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        image: true, // 开启图片插入功能
        video: false, // 开启视频插入功能
        audio: false, // 开启音频插入功能
        externalMedias: {
          image: true,
          audio: false,
          video: false,
          embed: false,
        },
        uploadFn: param => {
          const { OSS_CONFIG, OSS_PREFIX } = config;
          const ossClient = new OSS({ ...OSS_CONFIG });
          const { libraryId, file } = param;
          const { name } = file;
          const fileKey = `${libraryId}-${name}`;
          const objectKey = OSS_PREFIX + OSS_PREFIX_PLATFORM_NOTICE + fileKey;
          // eslint-disable-next-line func-names
          co(function*() {
            yield ossClient.multipartUpload(objectKey, file, {
              // 分片大小100kb
              partSize: 102400,
              mime: 'image/jpeg',
              *progress(p) {
                param.progress(p * 100);
              },
            });

            const newAdUrl = `https://${OSS_CONFIG.bucket}.${
              OSS_CONFIG.region
            }.aliyuncs.com/${objectKey}`;
            param.success({
              url: `${newAdUrl}`,
            });
          }).catch(err => {
            console.log(err);
            param.error({
              msg: `upload failed:${err}`,
            });
          });
        },
      },
      extendControls: [
        {
          type: 'button',
          className: style['preview-button'],
          text: <span>预览</span>,
          onClick: preview,
        },
      ],
    };

    return (
      <div>
        <Card>
          <Row>
            <Col {...formProps}>
              <FormLabel label="课程名称" />
              <Input
                placeholder="请输入课程名称"
                style={{ width: 400 }}
                value={title}
                onChange={e => {
                  dispatch({
                    type: 'studyAdd/setData',
                    payload: {
                      key: 'title',
                      value: e.target.value,
                    },
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col {...formProps}>
              <FormLabel label="课程简介" />
              <Input
                placeholder="请输入课程简介"
                style={{ width: 400 }}
                value={brief}
                onChange={e => {
                  dispatch({
                    type: 'studyAdd/setData',
                    payload: {
                      key: 'brief',
                      value: e.target.value,
                    },
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col {...formProps}>
              <FormLabel label="课程图片" />
              <PicUpload {...props} />
            </Col>
          </Row>
          <Row>
            <Col {...formProps}>
              <FormLabel label="课程详情" />
              <div
                style={{
                  borderRadius: 5,
                  border: 'solid 1px rgba(0, 0, 0, 0.25)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                <BraftEditor ref={this.setRef.bind(this)} {...editorProps} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                icon="save"
                onClick={() => {
                  dispatch({
                    type: 'studyAdd/setDatas',
                    payload: [{ key: 'messageDetail', value: this.editorInstance.getContent() }],
                  });
                  if (id && id > 0) {
                    dispatch({
                      type: 'studyAdd/updateStudy',
                    });
                  } else {
                    dispatch({
                      type: 'studyAdd/addStudy',
                    });
                  }
                }}
                loading={
                  id && id > 0
                    ? loading.effects['studyAdd/updateStudy']
                    : loading.effects['studyAdd/addStudy']
                }
              >
                保存
              </Button>
            </Col>
          </Row>
        </Card>
        <NoticeModal
          title="注意"
          dispatch={dispatch}
          info={studyAdd.noticeInfo}
          visible={studyAdd.noticeVisible}
          namespace="studyAdd"
        />
      </div>
    );
  }
}

export default connect(({ studyAdd, loading }) => ({ studyAdd, loading }))(StudyAddInstance);
