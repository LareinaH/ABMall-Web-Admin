/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Radio, Select, Row, Col } from 'antd';
import { connect } from 'dva';
import NoticeModal from '../NoticeModal';
import InviteQRcodeSingle from '../InviteQRcode/InviteQRcodeSingle';
import FormLabel from '../../components/MyComponent/FormLabel';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const IndexAd = ({ dispatch, loading, indexAd }) => {
  const { picList, commodityList, activityList } = indexAd;

  const getSelectContent = (adItem, index) => {
    const type = adItem.linkType;
    if (type === 'NOTHING') {
      return null;
    } else if (type === 'GOODS') {
      return (
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="请选择"
          value={adItem.linkParams}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={value => {
            const newAdItem = {
              ...adItem,
              linkParams: value,
            };

            dispatch({
              type: 'indexAd/saveAdUrlLocal',
              payload: {
                adItem: newAdItem,
                index,
              },
            });
          }}
        >
          {commodityList.map(item => (
            <Select.Option key={item.id.toString()}>{item.goodsName}</Select.Option>
          ))}
        </Select>
      );
    } else if (type === 'ACTIVIT') {
      return (
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="请选择"
          value={adItem.linkParams}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={value => {
            const newAdItem = {
              ...adItem,
              linkParams: value,
            };

            dispatch({
              type: 'indexAd/saveAdUrlLocal',
              payload: {
                adItem: newAdItem,
                index,
              },
            });
          }}
        >
          {activityList.map(item => (
            <Select.Option key={item.id.toString()}>{item.activityName}</Select.Option>
          ))}
        </Select>
      );
    }
  };

  const cardTitleContent = (titleText, adItem, index) => {
    return (
      <div>
        <Row>
          <Col span={24}>{titleText}</Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormLabel label="链接" />
            <RadioGroup
              value={adItem.linkType}
              onChange={e => {
                const newAdItem = {
                  ...adItem,
                  linkType: e.target.value,
                };

                dispatch({
                  type: 'indexAd/saveAdUrlLocal',
                  payload: {
                    adItem: newAdItem,
                    index,
                  },
                });
              }}
            >
              <RadioButton value="NOTHING">不关联</RadioButton>
              <RadioButton value="GOODS">商品</RadioButton>
              <RadioButton value="ACTIVIT">活动</RadioButton>
            </RadioGroup>
          </Col>
        </Row>
        <Row>
          <Col span={24}>{getSelectContent(adItem, index)}</Col>
        </Row>
      </div>
    );
  };

  const getCardList = () => {
    return picList.map((adItem, index) => {
      return (
        <InviteQRcodeSingle
          dispatch={dispatch}
          loading={loading}
          title={cardTitleContent(`第${index + 1}个广告图`, adItem, index)}
          adItem={adItem}
          index={index}
          key={index}
          nameSpace="indexAd"
          picWidth={500}
        />
      );
    });
  };

  return (
    <div>
      {getCardList()}
      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={indexAd.noticeInfo}
        visible={indexAd.noticeVisible}
        namespace="indexAd"
      />
    </div>
  );
};

export default connect(({ indexAd, loading }) => ({ indexAd, loading }))(IndexAd);
