var request = require('request');
var path = require('path');
var URL = require('url').URL;

function getBuffer(url, done) {
  var reqOpts = {
    url,
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

module.exports = {
  getBuffer,
  getFilename
};
