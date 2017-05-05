/* global process */

var ndjson = require('ndjson');
var through2 = require('through2');
var videoTweetToBuffer = require('./transforms/video-tweet-to-buffer');
var BufferToGit = require('./transforms/buffer-to-git');
var addHTMLFragment = require('./transforms/add-html-fragment');
var config = require('./config');
var request = require('request');
var AddCellsToPagesInGit = require('./transforms/add-cells-to-pages-in-git');
var UpdateIndexHTMLInGit = require('./transforms/update-index-html-in-git');
var AddSingleVideoPageInGit = require('./transforms/add-single-video-page-in-git');

var gitOpts = {
  branch: 'gh-pages',
  gitRepoOwner: config.github.gitRepoOwner,
  gitToken: config.github.gitToken,
  repo: config.github.repo,
  request: request,
  shouldSetUserAgent: true,
  videoDir: 'lookit/videos',
  metaDir: 'lookit/meta',
  htmlDir: 'lookit'
};

var bufferToGit = BufferToGit(gitOpts);
var addCellsToPagesInGit = AddCellsToPagesInGit(gitOpts);
var updateIndexHTMLInGit = UpdateIndexHTMLInGit(gitOpts);
var addSingleVideoPageInGit = AddSingleVideoPageInGit(gitOpts);

function createVideoPostingStreamChain() {
  var videoPackToBufferStream = createStreamWithTransform(
    videoTweetToBuffer, logError
  );
  var bufferToGitStream = createStreamWithTransform(bufferToGit, logError);
  var addHTMLFragmentStream = createStreamWithTransform(
    addHTMLFragment, logError
  );
  var updatePagesStream = createStreamWithTransform(
    addCellsToPagesInGit, logError
  );
  var updateIndexHTMLInGitStream = createStreamWithTransform(
    updateIndexHTMLInGit, logError
  );
  var addSingleVideoPageInGitStream = createStreamWithTransform(
    addSingleVideoPageInGit, logError
  );

  videoPackToBufferStream
    .pipe(addHTMLFragmentStream)
    .pipe(addSingleVideoPageInGitStream)
    .pipe(bufferToGitStream)
    .pipe(updatePagesStream)
    .pipe(updateIndexHTMLInGitStream)
    .pipe(ndjson.stringify())
    .pipe(process.stdout);

  // function updateIndexHTML(updatedPagesInfo) {
  //   console.log('updatedPagesInfo', JSON.stringify(updatedPagesInfo, null, 2));
  // }

  return videoPackToBufferStream;
}

function createStreamWithTransform(transform, errorCallback) {
  var stream = through2({objectMode: true}, transform);
  stream.on('error', errorCallback);
  return stream;
}

function logError(error) {
  console.log(error);
}

module.exports = createVideoPostingStreamChain;
