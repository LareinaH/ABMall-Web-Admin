import React from 'react';
import IndexAdSingle from './IndexAdSingle';

const IndexAd = ({ loading }) => {
  return (
    <div>
      <IndexAdSingle title="第一个广告图" loading={loading} />
      <IndexAdSingle title="第二个广告图" loading={loading} />
      <IndexAdSingle title="第三个广告图" loading={loading} />
    </div>
  );
};

export default IndexAd;
