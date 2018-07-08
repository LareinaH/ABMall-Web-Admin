import React from 'react';
import moment from 'moment';
import MD5 from 'md5-es';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, DatePicker, Select, InputNumber } from 'antd';
import NoticeModal from '../NoticeModal';
import FormLabel from '../../components/MyComponent/FormLabel';

import style from './index.less';

const { RangePicker } = DatePicker;

const ActivityAdd = ({ dispatch, loading, activityAdd }) => {
  const {
    id,
    activityName,
    gmtStart,
    gmtEnd,
    activityDesc,
    goodsList,
    selectGoods,
    activityBrief,
  } = activityAdd;
  const { leastSales, leastPerson, v1Award, v2Award, v3Award } = activityAdd;

  const setValue = (key, value) => {
    dispatch({
      type: 'activityAdd/setData',
      payload: {
        key,
        value,
      },
    });
  };

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
    initialContent: activityDesc,
    contentId: id ? MD5.hash(id.toString()) : MD5.hash(moment().format()),
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
            <FormLabel label="活动简介" />
            <Input
              placeholder="请输入活动简介"
              style={{ width: 400 }}
              value={activityBrief}
              onChange={e => {
                dispatch({
                  type: 'activityAdd/setData',
                  payload: {
                    key: 'activityBrief',
                    value: e.target.value,
                  },
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col {...formProps}>
            <FormLabel label="添加商品" />
            <Select
              showSearch
              style={{ width: 400 }}
              placeholder="请选择商品"
              optionFilterProp="children"
              value={selectGoods}
              onChange={value => {
                dispatch({
                  type: 'activityAdd/setData',
                  payload: {
                    key: 'selectGoods',
                    value,
                  },
                });
              }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {goodsList.map(item => (
                <Select.Option key={item.id}>{`${item.breif}(${item.id})`}</Select.Option>
              ))}
            </Select>
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
              value={[gmtStart, gmtEnd]}
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
        <Row className={style.activitySetting}>
          <Col {...formProps}>
            <FormLabel label="活动设置" />
            <Card title="活动达标设置">
              <Row>
                <Col>
                  <FormLabel label="直推最低销售额" />
                  <InputNumber
                    value={leastSales}
                    onChange={value => setValue('leastSales', value)}
                    min={0}
                    style={{ width: 100 }}
                    formatter={value => `${value}元`}
                    parser={value => value.replace('元', '')}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormLabel label="直推最低人数" />
                  <InputNumber
                    value={leastPerson}
                    onChange={value => setValue('leastPerson', value)}
                    min={0}
                    style={{ width: 100 }}
                    formatter={value => `${value}人`}
                    parser={value => value.replace('人', '')}
                  />
                </Col>
              </Row>
            </Card>
            <Card title="活动单品奖励">
              <Row>
                <Col>
                  <FormLabel label="V1奖励" />
                  <InputNumber
                    value={v1Award}
                    onChange={value => setValue('v1Award', value)}
                    min={0}
                    max={100}
                    style={{ width: 100 }}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormLabel label="V2奖励" />
                  <InputNumber
                    value={v2Award}
                    onChange={value => setValue('v2Award', value)}
                    min={0}
                    max={100}
                    style={{ width: 100 }}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormLabel label="V3奖励" />
                  <InputNumber
                    value={v3Award}
                    onChange={value => setValue('v3Award', value)}
                    min={0}
                    max={100}
                    style={{ width: 100 }}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Col>
              </Row>
            </Card>
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
                    type: 'activityAdd/updateActivity',
                  });
                } else {
                  dispatch({
                    type: 'activityAdd/addActivity',
                  });
                }
              }}
              loading={
                id && id > 0
                  ? loading.effects['activityAdd/updateActivity']
                  : loading.effects['activityAdd/addActivity']
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
