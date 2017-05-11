var GitHubFile = require('github-file');
var sb = require('standard-bail')();
var omit = require('lodash.omit');
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

    if (newCell.latestSha) {
      bufferGitPayload.parentSha = newCell.latestSha;
    }

    // It's really important to make these updates serially so that one doesn't commit
    // between the other's sha-get and commit, thereby changing the branch tip.
    githubFileForBuffers.update(bufferGitPayload, sb(updateMetadata, done));

    function updateMetadata(bufferCommit) {
      newCell.latestSha = bufferCommit.sha;
      var metadataGitPayload = {
        filePath: metaDir + '/' + newCell.tweetId + '.json',
        content: JSON.stringify(newCell),
        message: 'off-brand-vine posting video metadata',
        // parentSha: newCell.latestSha
      };
      githubFileForText.update(metadataGitPayload, sb(passPackage, done));
    }

    function passPackage(commit) {
      newCell.postedToGit = true;
      newCell.latestSha = commit.sha;
      stream.push(newCell);
      done();
    }
  }
}

module.exports = BufferToGit;
