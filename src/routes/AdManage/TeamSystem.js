/* eslint-disable react/no-array-index-key */
import React from 'react';
import { connect } from 'dva';
import NoticeModal from '../NoticeModal';
import InviteQRcodeSingle from '../InviteQRcode/InviteQRcodeSingle';

const TeamSystem = ({ dispatch, loading, teamSystem }) => {
  const { teamSystemImageList } = teamSystem;
  const titleList = ['团队体系广告图'];

  const getCardList = () => {
    return teamSystemImageList.map((adItem, index) => {
      return (
        <InviteQRcodeSingle
          dispatch={dispatch}
          loading={loading}
          title={titleList[index]}
          adItem={adItem}
          index={index}
          key={index}
          nameSpace="teamSystem"
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
        info={teamSystem.noticeInfo}
        visible={teamSystem.noticeVisible}
        namespace="teamSystem"
      />
    </div>
  );
};

export default connect(({ teamSystem, loading }) => ({ teamSystem, loading }))(TeamSystem);
