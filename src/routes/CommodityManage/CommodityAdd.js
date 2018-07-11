/* eslint-disable no-unneeded-ternary */
import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Select, InputNumber, Button } from 'antd';
import CommoditySpec from './CommoditySpec';
import PicUpload from './PicUpload';
import NoticeModal from '../NoticeModal';
import config from '../../utils/config';

const CommodityAdd = ({ dispatch, loading, commodityAdd }) => {
  const { goodsVo, categoryList, specUnitList } = commodityAdd;
  const {
    goodsName,
    groupId,
    images,
    virtualSalesAmount,
    description,
    goodsSpecificationList,
    breif,
  } = goodsVo;

  const formProps = {
    span: 16,
    style: {
      display: 'flex',
    },
  };

  const getFormLabel = label => {
    return (
      <span style={{ paddingRight: 8, width: 100 }}>
        <span style={{ paddingRight: 4, color: 'red', fontFamily: 'SimSun' }}>*</span>
        {label}:
      </span>
    );
  };

  const buttonRowHeight = 40;
  const picWidth = 140;
  const picHeight = 160;

  const { OSS_PREFIX_GOODS, OSS_PREFIX_DESCRIPTION } = config;

  const props = {
    picList: images,
    picWidth,
    picHeight,
    buttonRowHeight,
    ossDirectoryPrefix: OSS_PREFIX_GOODS,
    onChangeUploadingStatus: (outIndex, status) => {
      images[outIndex].uploading = status;

      dispatch({
        type: 'commodityAdd/setGoodsVo',
        payload: {
          key: 'images',
          value: images,
        },
      });
    },
    onUpdateAdItemUrl: (outIndex, newAdUrl, oldAdUrl) => {
      images[outIndex].adUrl = newAdUrl;

      if (!oldAdUrl) {
        images.push({
          adUrl: '',
          uploading: false,
        });
      }

      dispatch({
        type: 'commodityAdd/setGoodsVo',
        payload: {
          key: 'images',
          value: images,
        },
      });
    },
    onDeleteAdItem: outIndex => {
      images.splice(outIndex, 1);

      dispatch({
        type: 'commodityAdd/setGoodsVo',
        payload: {
          key: 'images',
          value: images,
        },
      });
    },
  };

  const specListProps = {
    isEdit: goodsVo.id ? true : false,
    dispatch,
    specUnitList,
    goodsSpecificationList,
    getFormLabel,
    formProps,
  };

  const descriptionProps = {
    picList: description,
    picWidth,
    picHeight,
    buttonRowHeight,
    ossDirectoryPrefix: OSS_PREFIX_DESCRIPTION,
    onChangeUploadingStatus: (outIndex, status) => {
      description[outIndex].uploading = status;

      dispatch({
        type: 'commodityAdd/setGoodsVo',
        payload: {
          key: 'description',
          value: description,
        },
      });
    },
    onUpdateAdItemUrl: (outIndex, newAdUrl, oldAdUrl) => {
      description[outIndex].adUrl = newAdUrl;

      if (!oldAdUrl) {
        description.push({
          adUrl: '',
          uploading: false,
        });
      }

      dispatch({
        type: 'commodityAdd/setGoodsVo',
        payload: {
          key: 'description',
          value: description,
        },
      });
    },
    onDeleteAdItem: outIndex => {
      description.splice(outIndex, 1);

      dispatch({
        type: 'commodityAdd/setGoodsVo',
        payload: {
          key: 'description',
          value: description,
        },
      });
    },
  };

  return (
    <Card>
      <Row>
        <Col {...formProps}>
          {getFormLabel('商品名称')}
          <Input
            placeholder="请输入商品名称"
            style={{ width: 400 }}
            value={goodsName}
            onChange={e => {
              dispatch({
                type: 'commodityAdd/setGoodsVo',
                payload: {
                  key: 'goodsName',
                  value: e.target.value,
                },
              });
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col {...formProps}>
          {getFormLabel('商品简介')}
          <Input.TextArea
            placeholder="请输入商品简介"
            style={{ width: 400 }}
            value={breif}
            onChange={e => {
              dispatch({
                type: 'commodityAdd/setGoodsVo',
                payload: {
                  key: 'breif',
                  value: e.target.value,
                },
              });
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col {...formProps}>
          {getFormLabel('商品分类')}
          <Select
            showSearch
            style={{ width: 400 }}
            placeholder="请选择商品分类"
            optionFilterProp="children"
            value={groupId}
            onChange={value => {
              dispatch({
                type: 'commodityAdd/setGoodsVo',
                payload: {
                  key: 'groupId',
                  value,
                },
              });
            }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {categoryList.map(item => (
              <Select.Option key={item.id}>{item.goodsGroupName}</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col {...formProps}>
          {getFormLabel('虚拟销量基础值')}
          <InputNumber
            style={{ width: 400 }}
            min={0}
            max={999999}
            value={virtualSalesAmount}
            onChange={value => {
              dispatch({
                type: 'commodityAdd/setGoodsVo',
                payload: {
                  key: 'virtualSalesAmount',
                  value,
                },
              });
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col {...formProps}>
          {getFormLabel('商品图')}
          <PicUpload {...props} />
        </Col>
      </Row>
      <Row>
        <CommoditySpec {...specListProps} />
      </Row>
      <Row>
        <Col {...formProps}>
          {getFormLabel('商品详情')}
          <PicUpload {...descriptionProps} />
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            icon="save"
            onClick={() => {
              if (goodsVo.id && goodsVo.id > 0) {
                dispatch({
                  type: 'commodityAdd/updateCommodity',
                });
              } else {
                dispatch({
                  type: 'commodityAdd/addCommodity',
                });
              }
            }}
            loading={
              goodsVo.id && goodsVo.id > 0
                ? loading.effects['commodityAdd/updateCommodity']
                : loading.effects['commodityAdd/addCommodity']
            }
          >
            保存
          </Button>
        </Col>
      </Row>
      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={commodityAdd.noticeInfo}
        visible={commodityAdd.noticeVisible}
        namespace="commodityAdd"
      />
    </Card>
  );
};

export default Form.create()(
  connect(({ commodityAdd, loading }) => ({ commodityAdd, loading }))(CommodityAdd)
);
