import React from 'react';
import { connect } from 'dva';
import NoticeModal from './NoticeModal';
import InviteQRcodeSingle from './InviteQRcodeSingle';

const InviteQRcode = ({ dispatch, loading, inviteQRcode }) => {
  return (
    <div>
      <InviteQRcodeSingle
        loading={loading}
        title="V1背景图"
        imageHref="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
      <NoticeModal
        title="注意"
        dispatch={dispatch}
        info={inviteQRcode.noticeInfo}
        visible={inviteQRcode.noticeVisible}
        namespace="inviteQRcode"
      />
    </div>
  );
};

export default connect(({ inviteQRcode, loading }) => ({ inviteQRcode, loading }))(InviteQRcode);
