var request = require('request');
var sb = require('standard-bail')();
var cloneDeep = require('lodash.clonedeep');

function videoTweetToBuffer(videoTweetPackage, enc, done) {
  var stream = this;
  var videoInfo = videoTweetPackage.videos.reduce(
    getHighestBitrateVideo, {bitrate: 0}
  );
  getBuffer(videoInfo.url, sb(pushBufferPackage, done));

  function pushBufferPackage(buffer) {
    var bufferPackage = cloneDeep(videoTweetPackage);
    bufferPackage.buffer = buffer;
    bufferPackage.videoBufferInfo = cloneDeep(videoInfo);
    stream.push(bufferPackage);
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
