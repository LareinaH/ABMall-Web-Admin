const showTotal = (total, range) => {
  return `共 ${total} 条数据, 当前是第${range[0]}条-第${range[1]}条`;
};

const pagination = {
  size: 'small',
  showTotal,
  showSizeChanger: true,
  showQuickJumper: true,
  defaultPageSize: 10,
  hideOnSinglePage: true,
  pageSizeOptions: ['10', '20', '50', '100'],
};

export { pagination };
