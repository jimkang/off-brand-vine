var request = require('request');
var sb = require('standard-bail')();
var cloneDeep = require('lodash.clonedeep');

function videoTweetToBuffer(cell, enc, done) {
  var stream = this;
  var videoInfo = cell.videos.reduce(
    getHighestBitrateVideo, {bitrate: 0}
  );
  getBuffer(videoInfo.url, sb(pushBufferPackage, done));

  function pushBufferPackage(buffer) {
    var newCell = cloneDeep(cell);
    newCell.buffer = buffer;
    newCell.videoBufferInfo = cloneDeep(videoInfo);
    stream.push(newCell);
    done();
  }
}

function getHighestBitrateVideo(highestBitrateVideo, video) {
  if (video.bitrate && video.bitrate > highestBitrateVideo.bitrate) {
    return video;
  }
  else {
    return highestBitrateVideo;
  }
}

function getBuffer(url, done) {
  var reqOpts = {
    url: url,
    encoding: null
  };
  request(reqOpts, passBody);

  function passBody(error, res, body) {
    if (error) {
      // For now, don't stop the stream. TODO: Consider the type of error.
      console.error(error);
    }
    done(null, body);
  }
}

module.exports = videoTweetToBuffer;
