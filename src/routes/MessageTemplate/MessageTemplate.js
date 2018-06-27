import React from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Spin, Form } from 'antd';
import NoticeModal from '../NoticeModal';

const FormItem = Form.Item;

const MessageTemplate = ({
  dispatch,
  loading,
  messageTemplate,
  form: { getFieldDecorator, validateFields },
}) => {
  const {
    PROMOTION_AWARD_1,
    PROMOTION_AWARD_2,
    SHARE_AWARD_1,
    SHARE_AWARD_2,
    EXECUTIVE_AWARD,
  } = messageTemplate.keyPairs;
  const saveKeyPairs = () => {
    validateFields(
      [
        'PROMOTION_AWARD_1',
        'PROMOTION_AWARD_2',
        'SHARE_AWARD_1',
        'SHARE_AWARD_2',
        'EXECUTIVE_AWARD',
      ],
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'messageTemplate/saveKeyPairs',
            payload: values,
          });
        }
      }
    );
  };

  return (
    <Card>
      {loading.effects['messageTemplate/getKeyValues'] ? (
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Spin tip="正在读取消息模板配置..." />
          </Col>
        </Row>
      ) : (
        <div>
          <Row>
            <Col span={24}>
              <Form layout="inline">
                <FormItem label="晋级奖励:">
                  {getFieldDecorator('PROMOTION_AWARD_1', {
                    rules: [
                      {
                        required: true,
                        message: '模板内容不能为空,最大长度为100',
                        max: 100,
                      },
                    ],
                    initialValue: PROMOTION_AWARD_1.value,
                  })(<Input style={{ width: 400 }} />)}
                </FormItem>
                <FormItem label="v*级">
                  {getFieldDecorator('PROMOTION_AWARD_2', {
                    rules: [
                      {
                        required: true,
                        message: '模板内容不能为空,最大长度为100',
                        max: 100,
                      },
                    ],
                    initialValue: PROMOTION_AWARD_2.value,
                  })(<Input style={{ width: 400 }} />)}
                </FormItem>
                ****元
              </Form>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form layout="inline">
                <FormItem label="分享奖励:">
                  {getFieldDecorator('SHARE_AWARD_1', {
                    rules: [
                      {
                        required: true,
                        message: '模板内容不能为空,最大长度为100',
                        max: 100,
                      },
                    ],
                    initialValue: SHARE_AWARD_1.value,
                  })(<Input style={{ width: 400 }} />)}
                </FormItem>
                <FormItem label="***元">
                  {getFieldDecorator('SHARE_AWARD_2', {
                    rules: [
                      {
                        required: true,
                        message: '模板内容不能为空,最大长度为100',
                        max: 100,
                      },
                    ],
                    initialValue: SHARE_AWARD_2.value,
                  })(<Input style={{ width: 400 }} />)}
                </FormItem>
                ****元
              </Form>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form layout="inline">
                <FormItem label="高管薪酬:">
                  {getFieldDecorator('EXECUTIVE_AWARD', {
                    rules: [
                      {
                        required: true,
                        message: '模板内容不能为空,最大长度为100',
                        max: 100,
                      },
                    ],
                    initialValue: EXECUTIVE_AWARD.value,
                  })(<Input style={{ width: 400 }} />)}
                </FormItem>
                ****元
              </Form>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={2}>
              <Button
                loading={loading.effects['messageTemplate/saveKeyPairs']}
                type="primary"
                icon="save"
                onClick={saveKeyPairs}
              >
                保存
              </Button>
            </Col>
          </Row>
        </div>
      )}
      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={messageTemplate.noticeInfo}
        visible={messageTemplate.noticeVisible}
        namespace="messageTemplate"
      />
    </Card>
  );
};

export default Form.create()(
  connect(({ messageTemplate, loading }) => ({ messageTemplate, loading }))(MessageTemplate)
);
