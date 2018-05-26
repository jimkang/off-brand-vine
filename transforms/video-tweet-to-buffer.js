var request = require('request');
var sb = require('standard-bail')();
var cloneDeep = require('lodash.clonedeep');
var path = require('path');
var URL = require('url').URL;

function videoTweetToBuffer(cell, enc, done) {
  var videoInfo = cell.videos.reduce(
    getHighestBitrateVideo, {bitrate: 0}
  );
  getBuffer(videoInfo.url, sb(pushBufferPackage, done));

  function pushBufferPackage(buffer) {
    var newCell = cloneDeep(cell);
    newCell.buffer = buffer;
    newCell.videoBufferInfo = cloneDeep(videoInfo);
    newCell.videoFilename = getFilename(newCell.videoBufferInfo.url);    
    done(null, newCell);
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

function getFilename(url) {
  var fileURL = new URL(url);
  return path.basename(fileURL.pathname);
}

module.exports = videoTweetToBuffer;
