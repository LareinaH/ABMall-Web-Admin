/* eslint-disable react/no-array-index-key */
import React from 'react';
import { connect } from 'dva';
import NoticeModal from '../NoticeModal';
import InviteQRcodeSingle from '../InviteQRcode/InviteQRcodeSingle';

const IndexAd = ({ dispatch, loading, indexAd }) => {
  const { picList } = indexAd;
  const titleList = ['第一个广告图', '第二个广告图', '第三个广告图'];

  const getCardList = () => {
    return picList.map((adItem, index) => {
      return (
        <InviteQRcodeSingle
          dispatch={dispatch}
          loading={loading}
          title={titleList[index]}
          adItem={adItem}
          index={index}
          key={index}
          nameSpace="indexAd"
          picWidth={500}
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
        info={indexAd.noticeInfo}
        visible={indexAd.noticeVisible}
        namespace="indexAd"
      />
    </div>
  );
};

export default connect(({ indexAd, loading }) => ({ indexAd, loading }))(IndexAd);
