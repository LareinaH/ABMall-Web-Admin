/* eslint-disable no-param-reassign,no-param-reassign,react/no-array-index-key */
import React from 'react';
import { Row, Col, Input, Select, Checkbox, InputNumber, Icon, Button, Divider } from 'antd';

const CommoditySpec = ({
  isEdit,
  dispatch,
  specUnitList,
  goodsSpecificationList,
  getFormLabel,
  formProps,
}) => {
  return (
    <div>
      {goodsSpecificationList &&
        goodsSpecificationList.map((goodsSpec, index) => {
          const {
            goodsSpecificationName,
            stock,
            price,
            preferentialPrice,
            isOnSell,
            goodsSpecificationNo,
            goodsSpecOptionValue,
          } = goodsSpec;

          return (
            <div key={index}>
              <Divider />
              <Col span={20}>
                <Row>
                  <Col {...formProps}>
                    {getFormLabel('商品规格')}
                    <Input
                      placeholder="请输入商品规格"
                      style={{ width: 400 }}
                      value={goodsSpecificationName}
                      onChange={e => {
                        goodsSpecificationList[index].goodsSpecificationName = e.target.value;
                        dispatch({
                          type: 'commodityAdd/setGoodsVo',
                          payload: {
                            key: 'goodsSpecificationList',
                            value: goodsSpecificationList,
                          },
                        });
                      }}
                    />
                    <Select
                      showSearch
                      style={{ width: 400 }}
                      placeholder="请选择商品规格"
                      optionFilterProp="children"
                      value={goodsSpecOptionValue}
                      onChange={value => {
                        goodsSpecificationList[index].goodsSpecOptionValue = value;
                        goodsSpecificationList[index].goodsSpecificationName = value;
                        dispatch({
                          type: 'commodityAdd/setGoodsVo',
                          payload: {
                            key: 'goodsSpecificationList',
                            value: goodsSpecificationList,
                          },
                        });
                      }}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {specUnitList.map(item => <Select.Option key={item}>{item}</Select.Option>)}
                    </Select>
                  </Col>
                </Row>
                <Row>
                  <Col {...formProps}>
                    {getFormLabel('商品编号')}
                    <Input
                      placeholder="请输入商品编号"
                      style={{ width: 400 }}
                      disabled={isEdit}
                      value={goodsSpecificationNo}
                      onChange={e => {
                        goodsSpecificationList[index].goodsSpecificationNo = e.target.value;
                        dispatch({
                          type: 'commodityAdd/setGoodsVo',
                          payload: {
                            key: 'goodsSpecificationList',
                            value: goodsSpecificationList,
                          },
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col {...formProps}>
                    {getFormLabel('库存')}
                    <InputNumber
                      style={{ width: 400 }}
                      min={0}
                      max={999999}
                      value={stock}
                      onChange={value => {
                        goodsSpecificationList[index].stock = value;
                        dispatch({
                          type: 'commodityAdd/setGoodsVo',
                          payload: {
                            key: 'goodsSpecificationList',
                            value: goodsSpecificationList,
                          },
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col {...formProps}>
                    {getFormLabel('原价显示值')}
                    <InputNumber
                      style={{ width: 400 }}
                      min={0}
                      max={999999}
                      value={price}
                      precision={2}
                      onChange={value => {
                        goodsSpecificationList[index].price = value;
                        dispatch({
                          type: 'commodityAdd/setGoodsVo',
                          payload: {
                            key: 'goodsSpecificationList',
                            value: goodsSpecificationList,
                          },
                        });
                      }}
                    />{' '}
                    元
                  </Col>
                </Row>
                <Row>
                  <Col {...formProps}>
                    {getFormLabel('销售价')}
                    <InputNumber
                      style={{ width: 400 }}
                      min={0}
                      max={999999}
                      value={preferentialPrice}
                      precision={2}
                      onChange={value => {
                        goodsSpecificationList[index].preferentialPrice = value;
                        dispatch({
                          type: 'commodityAdd/setGoodsVo',
                          payload: {
                            key: 'goodsSpecificationList',
                            value: goodsSpecificationList,
                          },
                        });
                      }}
                    />{' '}
                    元
                  </Col>
                  <Col span={4}>
                    <Checkbox
                      checked={isOnSell}
                      onChange={e => {
                        goodsSpecificationList[index].isOnSell = e.target.checked;
                        dispatch({
                          type: 'commodityAdd/setGoodsVo',
                          payload: {
                            key: 'goodsSpecificationList',
                            value: goodsSpecificationList,
                          },
                        });
                      }}
                    >
                      上架
                    </Checkbox>
                  </Col>
                </Row>
              </Col>
              <Col span={2}>
                <div>
                  <Button
                    type="danger"
                    onClick={() => {
                      goodsSpecificationList.splice(index, 1);

                      dispatch({
                        type: 'commodityAdd/setGoodsVo',
                        payload: {
                          key: 'goodsSpecificationList',
                          value: goodsSpecificationList,
                        },
                      });
                    }}
                  >
                    <Icon type="delete" /> 删除
                  </Button>
                </div>
              </Col>
            </div>
          );
        })}
      <Button
        style={{ width: '100%' }}
        onClick={() => {
          goodsSpecificationList.push({
            goodsSpecificationName: undefined,
            stock: 0,
            price: 0.0,
            preferentialPrice: 0.0,
            isOnSell: false,
            goodsSpecificationNo: undefined,
          });

          dispatch({
            type: 'commodityAdd/setGoodsVo',
            payload: {
              key: 'goodsSpecificationList',
              value: goodsSpecificationList,
            },
          });
        }}
        type="dashed"
      >
        <Icon type="plus" /> 添加商品规格
      </Button>
    </div>
  );
};

export default CommoditySpec;
