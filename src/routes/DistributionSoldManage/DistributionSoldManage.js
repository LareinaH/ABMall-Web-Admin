import React from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Spin, Form } from 'antd';
import { getObjectKeyValueOr } from '../../utils/utils';
import NoticeModal from '../NoticeModal';

const FormItem = Form.Item;

const DistributionSoldManage = ({
  dispatch,
  loading,
  distributionSoldManage,
  form: { getFieldDecorator, validateFields },
}) => {
  const {
    PROMOTION_AGENT_TIMES,
    PROMOTION_AGENT_MONEY,
    PROMOTION_V1_SHARE_PEOPLE,
    PROMOTION_V1_MONEY,
    PROMOTION_V2_SHARE_PEOPLE,
    PROMOTION_V2_MONEY,
    PROMOTION_V3_SHARE_PEOPLE,
    PROMOTION_V3_MONEY,

    SHARE_AWARD_V1,
    SHARE_AWARD_V2,
    SHARE_AWARD_V3,
    SHARE_AWARD_WHITE,
    SHARE_AWARD_AGENT,

    PROMOTION_AWARD_V1,
    PROMOTION_AWARD_V2,
    PROMOTION_AWARD_V3,

    EXECUTIVE_AWARD_V1,
    EXECUTIVE_AWARD_V2,
    EXECUTIVE_AWARD_V3,

    V3_AWARD_SHARE_PEOPLE,
    V3_AWARD_TOTLE_AWARD,
    V3_AWARD_MONEY,
  } = distributionSoldManage.keyPairs;

  const saveKeyPairs = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'distributionSoldManage/saveKeyPairs',
          payload: values,
        });
      }
    });
  };

  const cardStyle = {
    marginBottom: 8,
  };

  return (
    <Card>
      {loading.effects['distributionSoldManage/getKeyValues'] ? (
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Spin tip="正在读取消息模板配置..." />
          </Col>
        </Row>
      ) : (
        <div>
          <Card title="晋级条件" style={cardStyle}>
            <Row>
              <Col span={24}>
                <Form layout="inline">
                  <FormItem label="代言人购物次数">
                    {getFieldDecorator('PROMOTION_AGENT_TIMES', {
                      rules: [
                        {
                          required: true,
                          message: '请填写代言人购物次数',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_AGENT_TIMES, 'value', ''),
                    })(<Input addonAfter="次" style={{ width: 400 }} />)}
                  </FormItem>
                  <FormItem label="代理人累计购物额度">
                    {getFieldDecorator('PROMOTION_AGENT_MONEY', {
                      rules: [
                        {
                          required: true,
                          message: '请填写代理人累计购物额度',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_AGENT_MONEY, 'value', ''),
                    })(<Input addonAfter="元" style={{ width: 400 }} />)}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form layout="inline">
                  <FormItem label="V1直接分享人数">
                    {getFieldDecorator('PROMOTION_V1_SHARE_PEOPLE', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V1直接分享人数',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_V1_SHARE_PEOPLE, 'value', ''),
                    })(<Input addonAfter="人" style={{ width: 400 }} />)}
                  </FormItem>
                  <FormItem label="V1团队购物额">
                    {getFieldDecorator('PROMOTION_V1_MONEY', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V1团队购物额',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_V1_MONEY, 'value', ''),
                    })(<Input addonAfter="元" style={{ width: 400 }} />)}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form layout="inline">
                  <FormItem label="V2直接分享人数">
                    {getFieldDecorator('PROMOTION_V2_SHARE_PEOPLE', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V2直接分享人数',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_V2_SHARE_PEOPLE, 'value', ''),
                    })(<Input addonAfter="人" style={{ width: 400 }} />)}
                  </FormItem>
                  <FormItem label="V2团队购物额">
                    {getFieldDecorator('PROMOTION_V2_MONEY', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V2团队购物额',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_V2_MONEY, 'value', ''),
                    })(<Input addonAfter="元" style={{ width: 400 }} />)}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form layout="inline">
                  <FormItem label="V3直接分享人数">
                    {getFieldDecorator('PROMOTION_V3_SHARE_PEOPLE', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V3直接分享人数',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_V3_SHARE_PEOPLE, 'value', ''),
                    })(<Input addonAfter="人" style={{ width: 400 }} />)}
                  </FormItem>
                  <FormItem label="V3团队购物额">
                    {getFieldDecorator('PROMOTION_V3_MONEY', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V3团队购物额',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_V3_MONEY, 'value', ''),
                    })(<Input addonAfter="元" style={{ width: 400 }} />)}
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Card>
          <Card title="分享奖励" style={cardStyle}>
            <Form layout="inline">
              <Row>
                <Col span={24}>
                  <FormItem label="V1分享奖励">
                    {getFieldDecorator('SHARE_AWARD_V1', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V1分享奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(SHARE_AWARD_V1, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                  <FormItem label="用户分享奖励">
                    {getFieldDecorator('SHARE_AWARD_WHITE', {
                      rules: [
                        {
                          required: true,
                          message: '请填写用户分享奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(SHARE_AWARD_WHITE, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="V2分享奖励">
                    {getFieldDecorator('SHARE_AWARD_V2', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V2分享奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(SHARE_AWARD_V2, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                  <FormItem label="代理人分享奖励">
                    {getFieldDecorator('SHARE_AWARD_AGENT', {
                      rules: [
                        {
                          required: true,
                          message: '请填写代理人分享奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(SHARE_AWARD_AGENT, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="V3分享奖励">
                    {getFieldDecorator('SHARE_AWARD_V3', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V3分享奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(SHARE_AWARD_V3, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="晋级奖励" style={cardStyle}>
            <Form layout="inline">
              <Row>
                <Col span={24}>
                  <FormItem label="V1晋升奖励">
                    {getFieldDecorator('PROMOTION_AWARD_V1', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V1晋升奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_AWARD_V1, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="V2晋升奖励">
                    {getFieldDecorator('PROMOTION_AWARD_V2', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V2晋升奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_AWARD_V2, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="V3晋升奖励">
                    {getFieldDecorator('PROMOTION_AWARD_V3', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V3晋升奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(PROMOTION_AWARD_V3, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="高管薪酬永久分成" style={cardStyle}>
            <Form layout="inline">
              <Row>
                <Col span={24}>
                  <FormItem label="V1高管薪酬">
                    {getFieldDecorator('EXECUTIVE_AWARD_V1', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V1高管薪酬',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(EXECUTIVE_AWARD_V1, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="V2高管薪酬">
                    {getFieldDecorator('EXECUTIVE_AWARD_V2', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V2高管薪酬',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(EXECUTIVE_AWARD_V2, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="V3高管薪酬">
                    {getFieldDecorator('EXECUTIVE_AWARD_V3', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V3高管薪酬',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(EXECUTIVE_AWARD_V3, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="V3额外晋级奖励" style={cardStyle}>
            <Form layout="inline">
              <Row>
                <Col span={24}>
                  <FormItem label="V3直接再分享人数">
                    {getFieldDecorator('V3_AWARD_SHARE_PEOPLE', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V3直接再分享人数',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(V3_AWARD_SHARE_PEOPLE, 'value', ''),
                    })(<Input addonAfter="人" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="V3累计收入（分享+高薪酬）">
                    {getFieldDecorator('V3_AWARD_TOTLE_AWARD', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V3累计收入',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(V3_AWARD_TOTLE_AWARD, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="V3享有额外奖励">
                    {getFieldDecorator('V3_AWARD_MONEY', {
                      rules: [
                        {
                          required: true,
                          message: '请填写V3享有额外奖励',
                          max: 100,
                        },
                      ],
                      initialValue: getObjectKeyValueOr(V3_AWARD_MONEY, 'value', ''),
                    })(<Input addonAfter="%" style={{ width: 400 }} />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Row type="flex" justify="center">
            <Col span={2}>
              <Button
                loading={loading.effects['distributionSoldManage/saveKeyPairs']}
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
        info={distributionSoldManage.noticeInfo}
        visible={distributionSoldManage.noticeVisible}
        namespace="distributionSoldManage"
      />
    </Card>
  );
};

export default Form.create()(
  connect(({ distributionSoldManage, loading }) => ({ distributionSoldManage, loading }))(
    DistributionSoldManage
  )
);
