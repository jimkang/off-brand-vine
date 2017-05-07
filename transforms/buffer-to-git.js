var GitHubFile = require('github-file');
var sb = require('standard-bail')();
var omit = require('lodash.omit');
var queue = require('d3-queue').queue;
var cloneDeep = require('lodash.clonedeep');
var defaults = require('lodash.defaults');
var encoders = require('../base-64-encoders');

function BufferToGit(opts) {
  var videoDir = opts.videoDir;
  var metaDir = opts.metaDir;

  var githubFileForBuffers = GitHubFile(
    defaults(
      cloneDeep(opts),
      {
        encodeInBase64: encoders.encodeInBase64,
        decodeFromBase64: encoders.decodeFromBase64
      }
    )
  );
  var githubFileForText = GitHubFile(
    defaults(
      cloneDeep(opts),
      {
        encodeInBase64: encoders.encodeTextInBase64,
        decodeFromBase64: encoders.decodeFromBase64ToText
      }
    )
  );

  return bufferToGit;

  function bufferToGit(cell, enc, done) {
    var stream = this;

    var newCell = omit(cell, 'buffer');

    var bufferGitPayload = {
      filePath: videoDir + '/' + newCell.videoFilename,
      content: cell.buffer,
      message: 'off-brand-vine posting video'
    };

    var metadataGitPayload = {
      filePath: metaDir + '/' + newCell.tweetId + '.json',
      content: JSON.stringify(newCell),
      message: 'off-brand-vine posting video metadata'
    };

    // It's really important to make these updates serially so that one doesn't commit
    // between the other's sha-get and commit, thereby changing the branch tip.
    var q = queue(1);
    q.defer(githubFileForBuffers.update, bufferGitPayload);
    q.defer(wait);
    q.defer(githubFileForText.update, metadataGitPayload);
    q.awaitAll(sb(passPackage, done));

    function passPackage() {
      newCell.postedToGit = true;
      stream.push(newCell);
      done();
    }
  }
}

function wait(done) {
  setTimeout(done, 1000);
}

module.exports = BufferToGit;
