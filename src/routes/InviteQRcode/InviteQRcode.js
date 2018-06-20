/* eslint-disable react/no-array-index-key */
import React from 'react';
import { connect } from 'dva';
import NoticeModal from '../NoticeModal';
import InviteQRcodeSingle from './InviteQRcodeSingle';

const InviteQRcode = ({ dispatch, loading, inviteQRcode }) => {
  const { invitingCodeList } = inviteQRcode;
  const titleList = ['V1背景图', 'V2背景图', 'V3背景图', '代理人'];

  const getCardList = () => {
    return invitingCodeList.map((adItem, index) => {
      return (
        <InviteQRcodeSingle
          dispatch={dispatch}
          loading={loading}
          title={titleList[index]}
          adItem={adItem}
          index={index}
          key={index}
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
        info={inviteQRcode.noticeInfo}
        visible={inviteQRcode.noticeVisible}
        namespace="inviteQRcode"
      />
    </div>
  );
};

export default connect(({ inviteQRcode, loading }) => ({ inviteQRcode, loading }))(InviteQRcode);
