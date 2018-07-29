import React, { Fragment } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import { Card, Row, Col, Tooltip, Icon, Spin } from 'antd';
import { ChartCard } from 'components/Charts';
import { Yuan, colResponsivePropsFor4Columns } from '../../common/tablePageProps';

const UserStat = ({ loading, userStat }) => {
  const {
    userTotalCount,
    agentMemberCount,
    agentMemberTotalCountLastDay,
    agentMemberTotalCountLastMonth,
    ordersTotalCountLastDay,
    ordersTotalCountLastMonth,
    memberOrdersCountAvg,
    memberOrdersMoneyAvg,
    repurchasePercent,
    repurchasePercentLastMonth,
    memberBuyPercent,
  } = userStat.statInfo;

  return (
    <Card>
      {loading.effects['userStat/getUserStat'] ? (
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Spin tip="正在查询用户统计信息..." />
          </Col>
        </Row>
      ) : (
        <Fragment>
          <Row gutter={24}>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title={
                  <Fragment>
                    <Icon type="user" />平台用户量
                  </Fragment>
                }
                action={
                  <Tooltip title="平台用户量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${numeral(userTotalCount).format('0,0')} 人`}
              />
            </Col>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="会员注册量"
                action={
                  <Tooltip title="会员注册量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${numeral(agentMemberCount).format('0,0')} 人`}
              />
            </Col>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="昨日会员注册量"
                action={
                  <Tooltip title="昨日会员注册量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${numeral(agentMemberTotalCountLastDay).format('0,0')} 人`}
              />
            </Col>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="上月会员注册量"
                action={
                  <Tooltip title="上月会员注册量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${numeral(agentMemberTotalCountLastMonth).format('0,0')} 人`}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="累积会员人均订单数"
                action={
                  <Tooltip title="累积至昨日会员订单总数/累积至昨日会员总数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${numeral(memberOrdersCountAvg).format('0,0')} 单`}
              />
            </Col>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="累积会员人均购物额"
                action={
                  <Tooltip title="累积至昨日会员购物总额/累积至昨日会员总数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={() => <Yuan>${memberOrdersMoneyAvg}</Yuan>}
              />
            </Col>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="昨日会员订单数"
                action={
                  <Tooltip title="昨日会员订单数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${numeral(ordersTotalCountLastDay).format('0,0')} 单`}
              />
            </Col>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="上月会员订单数"
                action={
                  <Tooltip title="上月会员订单数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${numeral(ordersTotalCountLastMonth).format('0,0')} 单`}
              />
            </Col>
          </Row>
          <Row gutter={24} type="flex" justify="space-around">
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="累积复购率"
                action={
                  <Tooltip title="累积至昨日复够用户数/累积至昨日用户数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${repurchasePercent} %`}
              />
            </Col>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="上月复购率"
                action={
                  <Tooltip title="上月复购率">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${repurchasePercentLastMonth} %`}
              />
            </Col>
            <Col {...colResponsivePropsFor4Columns}>
              <ChartCard
                bordered
                title="用户购买率"
                action={
                  <Tooltip title="累积至昨日有效订单用户数/累积至昨日用户总数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={`${memberBuyPercent} %`}
              />
            </Col>
          </Row>
        </Fragment>
      )}
    </Card>
  );
};

export default connect(({ userStat, loading }) => ({ userStat, loading }))(UserStat);
