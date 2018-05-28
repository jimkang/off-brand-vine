var sb = require('standard-bail')();
var cloneDeep = require('lodash.clonedeep');
var { getBuffer, getFilename } = require('../get-stuff');

function videoTweetToBuffer(cell, enc, done) {
  var videoInfo = cell.videos.reduce(getHighestBitrateVideo, { bitrate: 0 });
  getBuffer(videoInfo.url, sb(pushBufferPackage, done));

  function pushBufferPackage(buffer) {
    var newCell = cloneDeep(cell);
    newCell.buffer = buffer;
    newCell.videoBufferInfo = cloneDeep(videoInfo);
    newCell.mediaFilename = getFilename(newCell.videoBufferInfo.url);
    done(null, newCell);
  }
}

function getHighestBitrateVideo(highestBitrateVideo, video) {
  if (video.bitrate && video.bitrate > highestBitrateVideo.bitrate) {
    return video;
  } else {
    return highestBitrateVideo;
  }
}

module.exports = videoTweetToBuffer;
