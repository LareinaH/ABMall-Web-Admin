import React from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, DatePicker, Radio } from 'antd';
import NoticeModal from '../NoticeModal';
import PicUpload from '../CommodityManage/PicUpload';
import FormLabel from '../../components/MyComponent/FormLabel';
import config from '../../utils/config';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const NoticeAdd = ({ dispatch, loading, noticeAdd }) => {
  const { title, adsUrl, level, gmtPublish, id } = noticeAdd;

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
        type: 'noticeAdd/setData',
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
        type: 'noticeAdd/setData',
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
        type: 'noticeAdd/setData',
        payload: {
          key: 'adsUrl',
          value: adsUrl,
        },
      });
    },
  };

  return (
    <div>
      <Card>
        <Row>
          <Col {...formProps}>
            <FormLabel label="通知名称" />
            <Input
              placeholder="请输入通知名称"
              style={{ width: 400 }}
              value={title}
              onChange={e => {
                dispatch({
                  type: 'noticeAdd/setData',
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
            <FormLabel label="通知广告图" />
            <PicUpload {...props} />
          </Col>
        </Row>
        <Row>
          <Col {...formProps}>
            <FormLabel label="发布时间" />
            <DatePicker
              showTime
              style={{ width: 400 }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择发布时间"
              allowClear={false}
              defaultValue={gmtPublish}
              onOk={value => {
                console.log(value);
                dispatch({
                  type: 'noticeAdd/setData',
                  payload: {
                    key: 'gmtPublish',
                    value,
                  },
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col {...formProps}>
            <FormLabel label="发布级别" />
            <RadioGroup
              onChange={e => {
                dispatch({
                  type: 'noticeAdd/setData',
                  payload: {
                    key: 'level',
                    value: e.target.value,
                  },
                });
              }}
              value={level}
            >
              <RadioButton value="IMPORTANT_EMERGENCY">重要紧急</RadioButton>
              <RadioButton value="IMPORTANT_NOT_EMERGENCY">重要非紧急</RadioButton>
              <RadioButton value="NOT_IMPORTANT_EMERGENCY">紧急非重要</RadioButton>
              <RadioButton value="NOT_IMPORTANT_NOT_EMERGENCY">非重要非紧急</RadioButton>
            </RadioGroup>
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
                    type: 'noticeAdd/updateNotice',
                  });
                } else {
                  dispatch({
                    type: 'noticeAdd/addNotice',
                  });
                }
              }}
              loading={
                id && id > 0
                  ? loading.effects['noticeAdd/updateNotice']
                  : loading.effects['noticeAdd/addNotice']
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
        info={noticeAdd.noticeInfo}
        visible={noticeAdd.noticeVisible}
        namespace="noticeAdd"
      />
    </div>
  );
};

export default connect(({ noticeAdd, loading }) => ({ noticeAdd, loading }))(NoticeAdd);
