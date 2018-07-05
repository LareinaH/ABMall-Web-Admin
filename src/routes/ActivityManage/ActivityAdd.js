import React from 'react';
import moment from 'moment';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, DatePicker } from 'antd';
import NoticeModal from '../NoticeModal';
import FormLabel from '../../components/MyComponent/FormLabel';

import style from './index.less';

const { RangePicker } = DatePicker;

const ActivityAdd = ({ dispatch, loading, activityAdd }) => {
  const { id, activityName, gmtStart, gmtEnd, activityDesc } = activityAdd;

  const formProps = {
    span: 24,
    style: {
      display: 'flex',
    },
  };

  const handleChange = content => {
    dispatch({
      type: 'activityAdd/setDatas',
      payload: [{ key: 'activityDesc', value: content }],
    });
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
            <div class="container">${activityDesc}</div>
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
    initialContent: '<p>Hello World!</p>',
    onChange: handleChange,
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
            <FormLabel label="活动名称" />
            <Input
              placeholder="请输入活动名称"
              style={{ width: 400 }}
              value={activityName}
              onChange={e => {
                dispatch({
                  type: 'activityAdd/setData',
                  payload: {
                    key: 'activityName',
                    value: e.target.value,
                  },
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col {...formProps}>
            <FormLabel label="活动时间" />
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              allowClear={false}
              defaultValue={[gmtStart, gmtEnd]}
              ranges={{
                今天: [moment(), moment().endOf('day')],
                本周: [moment(), moment().endOf('week')],
                本月: [moment(), moment().endOf('month')],
              }}
              onOk={value => {
                dispatch({
                  type: 'activityAdd/setDatas',
                  payload: [
                    {
                      key: 'gmtStart',
                      value: value[0],
                    },
                    {
                      key: 'gmtEnd',
                      value: value[1],
                    },
                  ],
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col {...formProps}>
            <FormLabel label="活动详情" />
            <div
              style={{
                borderRadius: 5,
                border: 'solid 1px rgba(0, 0, 0, 0.25)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <BraftEditor {...editorProps} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              icon="save"
              onClick={() => {
                if (id && id > 0) {
                  dispatch({
                    type: 'activityAdd/updateNotice',
                  });
                } else {
                  dispatch({
                    type: 'activityAdd/addNotice',
                  });
                }
              }}
              loading={
                id && id > 0
                  ? loading.effects['activityAdd/updateNotice']
                  : loading.effects['activityAdd/addNotice']
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
        info={activityAdd.noticeInfo}
        visible={activityAdd.noticeVisible}
        namespace="activityAdd"
      />
    </div>
  );
};

export default connect(({ activityAdd, loading }) => ({ activityAdd, loading }))(ActivityAdd);
