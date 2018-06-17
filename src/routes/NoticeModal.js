import React from 'react';
import { Modal, Button } from 'antd';

const NoticeModal = ({ dispatch, title, info, visible, namespace }) => {
  const hide = () => {
    dispatch({
      type: `${namespace}/hideNotice`,
    });
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={hide}
      onOk={hide}
      footer={[
        <Button key={info} type="primary" onClick={hide}>
          知道了
        </Button>,
      ]}
    >
      {info}
    </Modal>
  );
};

export default NoticeModal;
