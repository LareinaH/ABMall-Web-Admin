import { isUrl } from '../utils/utils';

const customMenuData = [
  {
    name: '广告管理',
    icon: 'switcher',
    path: 'adManage',
    children: [
      {
        name: '首页广告',
        path: 'indexAd',
        icon: 'picture',
      },
      {
        name: '团队体系',
        path: 'teamSystem',
        icon: 'team',
      },
    ],
  },
  {
    name: '活动设置',
    icon: 'api',
    path: 'activityManage',
    children: [
      {
        name: '添加活动',
        path: 'activityAdd',
        icon: 'plus-circle-o',
      },
      {
        name: '活动报表',
        path: 'activityList',
        icon: 'bar-chart',
      },
    ],
  },
  {
    name: '平台通知',
    icon: 'notification',
    path: 'platformNotice',
    children: [
      {
        name: '创建通知',
        path: 'noticeAdd',
        icon: 'plus-circle-o',
      },
      {
        name: '通知列表',
        path: 'noticeList',
        icon: 'bars',
      },
    ],
  },
  {
    name: '云鼎商学院',
    icon: 'cloud',
    path: 'contentStudy',
    children: [
      {
        name: '添加课程',
        path: 'studyAdd',
        icon: 'code',
      },
      {
        name: '课程列表',
        path: 'studyList',
        icon: 'desktop',
      },
    ],
  },
  {
    name: '消息模板',
    icon: 'message',
    path: 'messageTemplate',
  },
  {
    name: '邀请码图',
    icon: 'qrcode',
    path: 'inviteQRcode',
  },
  {
    name: '商品管理',
    icon: 'shopping-cart',
    path: 'commodityManage',
    children: [
      {
        name: '添加商品',
        path: 'commodityAdd',
        icon: 'plus-circle-o',
      },
      {
        name: '分类管理',
        path: 'categoryManage',
        icon: 'filter',
      },
      {
        name: '商品列表',
        path: 'commodityList',
        icon: 'bars',
      },
      {
        name: '下架商品库',
        path: 'offSold',
        icon: 'delete',
      },
    ],
  },
  {
    name: '报表统计',
    icon: 'area-chart',
    path: 'reportStat',
    children: [
      {
        name: '销售统计',
        path: 'soldStat',
        icon: 'dot-chart',
      },
      {
        name: '销售明细',
        path: 'soldDetails',
        icon: 'bar-chart',
      },
      {
        name: '销售排行',
        path: 'soldRank',
        icon: 'trophy',
      },
      {
        name: '用户统计',
        path: 'userStat',
        icon: 'user',
      },
      {
        name: '会员排行',
        path: 'memberStat',
        icon: 'idcard',
      },
    ],
  },
  {
    name: '订单管理',
    icon: 'barcode',
    path: 'orderManage',
    children: [
      {
        name: '订单列表',
        path: 'orderList',
        icon: 'profile',
      },
      {
        name: '订单统计',
        path: 'orderStat',
        icon: 'area-chart',
      },
    ],
  },
  {
    name: '分销设置',
    icon: 'fork',
    path: 'distributionSoldManage',
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(customMenuData);
