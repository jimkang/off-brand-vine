/* global Buffer */
var GitHubFile = require('github-file');
var sb = require('standard-bail')();
var omit = require('lodash.omit');
var queue = require('d3-queue').queue;
var cloneDeep = require('lodash.clonedeep');
var defaults = require('lodash.defaults');

function BufferToGit(opts) {
  var videoDir = opts.videoDir;
  var metaDir = opts.metaDir;

  var githubFileForBuffers = GitHubFile(
    defaults(
      cloneDeep(opts),
      {
        encodeInBase64: encodeInBase64,
        decodeFromBase64: decodeFromBase64
      }
    )
  );
  var githubFileForText = GitHubFile(
    defaults(
      cloneDeep(opts),
      {
        encodeInBase64: encodeTextInBase64,
        decodeFromBase64: decodeFromBase64ToText
      }
    )
  );

  return bufferToGit;

  function bufferToGit(bufferPackage, enc, done) {
    var stream = this;

    var newPackage = omit(bufferPackage, 'buffer');
    newPackage.videoFilename = getFilename(bufferPackage.videoBufferInfo.url);

    var bufferGitPayload = {
      filePath: videoDir + '/' + newPackage.videoFilename,
      content: bufferPackage.buffer,
      message: 'off-brand-vine posting video'
    };

    var metadataGitPayload = {
      filePath: metaDir + '/' + newPackage.tweetId + '.json',
      content: JSON.stringify(newPackage),
      message: 'off-brand-vine posting video metadata'
    };

    // It's really important to make these updates serially so that one doesn't commit
    // between the other's sha-get and commit, thereby changing the branch tip.
    var q = queue(1);
    q.defer(githubFileForBuffers.update, bufferGitPayload);
    q.defer(githubFileForText.update, metadataGitPayload);
    q.awaitAll(sb(passPackage, done));

    function passPackage() {
      newPackage.postedToGit = true;
      stream.push(newPackage);
      done();
    }
  }
}

function getFilename(url) {
  var parts = url.split('/');
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }
}

function encodeInBase64(buffer) {
  return buffer.toString('base64');
}

function decodeFromBase64(s) {
  return Buffer.from(s, 'base64');
}

function encodeTextInBase64(s) {
  return Buffer.from(s, 'utf8').toString('base64');
}

function decodeFromBase64ToText(s) {
  return Buffer.from(s, 'base64').toString('utf8');
}

module.exports = BufferToGit;
