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
    ],
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
