import React, { PureComponent } from 'react';
import OSS from 'ali-oss';
import co from 'co';
import moment from 'moment';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, DatePicker, Select, InputNumber } from 'antd';
import NoticeModal from '../NoticeModal';
import FormLabel from '../../components/MyComponent/FormLabel';

import style from './index.less';
import config from '../../utils/config';

const { RangePicker } = DatePicker;

class ActivityAddInstance extends PureComponent {
  constructor(props) {
    super(props);
    this.editorInstance = null;
  }

  setRef(ref) {
    this.editorInstance = ref;
  }

  render() {
    const { dispatch, loading, activityAdd } = this.props;
    const {
      id,
      activityName,
      gmtStart,
      gmtEnd,
      activityDesc,
      goodsList,
      activityBrief,
    } = activityAdd;

    const { shopActivityGoods, shopActivityConfigList } = activityAdd;

    const getConfValue = key => {
      if (shopActivityConfigList && shopActivityConfigList.length > 0) {
        return shopActivityConfigList.filter(x => x.item === key)[0].value;
      } else {
        return undefined;
      }
    };

    const setConfValue = (key, value) => {
      for (const item of shopActivityConfigList) {
        if (item.item === key) {
          item.value = value.toString();
        }
      }

      dispatch({
        type: 'activityAdd/setData',
        payload: {
          key: 'shopActivityConfigList',
          value: shopActivityConfigList,
        },
      });
    };

    const formProps = {
      span: 24,
      style: {
        display: 'flex',
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
      // contentId: id ? MD5.hash(id.toString()) : MD5.hash(moment().format()),
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
          const { OSS_CONFIG, OSS_PREFIX, OSS_PREFIX_ACTIVITY } = config;
          const ossClient = new OSS({ ...OSS_CONFIG });
          const { libraryId, file } = param;
          const { name } = file;
          const fileKey = `${libraryId}-${name}`;
          const objectKey = OSS_PREFIX + OSS_PREFIX_ACTIVITY + fileKey;
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
                value={
                  shopActivityGoods.goodsId === undefined
                    ? undefined
                    : shopActivityGoods.goodsId.toString()
                }
                onChange={value => {
                  const data = {};
                  Object.assign(data, shopActivityGoods, {
                    goodsId: Number.parseInt(value, 10),
                  });

                  dispatch({
                    type: 'activityAdd/setData',
                    payload: {
                      key: 'shopActivityGoods',
                      value: data,
                    },
                  });
                }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {goodsList.map(item => (
                  <Select.Option key={item.id.toString()}>
                    {`${item.breif}(${item.id})`}
                  </Select.Option>
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
                      value={getConfValue('PROMOTION_TOTLE_MONEY')}
                      onChange={value => setConfValue('PROMOTION_TOTLE_MONEY', value)}
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
                      value={getConfValue('ACTIVITY_TOTLE_SHARE_PEOPLE')}
                      onChange={value => setConfValue('ACTIVITY_TOTLE_SHARE_PEOPLE', value)}
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
                      value={getConfValue('ACTIVITY_AWARD_V1')}
                      onChange={value => setConfValue('ACTIVITY_AWARD_V1', value)}
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
                      value={getConfValue('ACTIVITY_AWARD_V2')}
                      onChange={value => setConfValue('ACTIVITY_AWARD_V2', value)}
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
                      value={getConfValue('ACTIVITY_AWARD_V3')}
                      onChange={value => setConfValue('ACTIVITY_AWARD_V3', value)}
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
                    type: 'activityAdd/setDatas',
                    payload: [{ key: 'activityDesc', value: this.editorInstance.getContent() }],
                  });

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
                提交生效
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
  }
}

const ActivityAdd = ({ dispatch, loading, activityAdd }) => {
  return <ActivityAddInstance {...{ dispatch, loading, activityAdd }} />;
};

export default connect(({ activityAdd, loading }) => ({ activityAdd, loading }))(ActivityAdd);
