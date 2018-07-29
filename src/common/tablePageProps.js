import React from 'react';
import { yuan } from 'components/Charts';

const showTotal = (total, range) => {
  return `共 ${total} 条数据, 当前是第${range[0]}条-第${range[1]}条`;
};

const pagination = {
  // size: 'small',
  showTotal,
  showSizeChanger: true,
  showQuickJumper: true,
  defaultPageSize: 10,
  hideOnSinglePage: false,
  pageSizeOptions: ['10', '20', '50', '100'],
};

const Yuan = ({ children }) => (
  <span
    dangerouslySetInnerHTML={{ __html: yuan(children) }}
  /> /* eslint-disable-line react/no-danger */
);

const colResponsivePropsFor4Columns = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
};

export { pagination, Yuan, colResponsivePropsFor4Columns };
