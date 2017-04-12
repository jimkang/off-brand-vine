/* global process */

var ndjson = require('ndjson');
var through2 = require('through2');
var videoTweetToBuffer = require('./transforms/video-tweet-to-buffer');
var BufferToGit = require('./transforms/buffer-to-git');
var addHTMLFragment = require('./transforms/add-html-fragment');
var config = require('./config');
var request = require('request');

var bufferToGit = BufferToGit({
  branch: 'gh-pages',
  gitRepoOwner: config.github.gitRepoOwner,
  gitToken: config.github.gitToken,
  repo: config.github.repo,
  request: request,
  shouldSetUserAgent: true,
  videoDir: 'lookit/videos',
  metaDir: 'lookit/meta'
});

function createVideoPostingStreamChain() {
  var videoPackToBufferStream = createStreamWithTransform(
    videoTweetToBuffer, logError
  );
  var bufferToGitStream = createStreamWithTransform(bufferToGit, logError);
  var addHTMLFragmentStream = createStreamWithTransform(
    addHTMLFragment, logError
  );

  videoPackToBufferStream
    .pipe(addHTMLFragmentStream)
    .pipe(bufferToGitStream)
    .pipe(ndjson.stringify())
    .pipe(process.stdout);

  bufferToGitStream.on('end', writeIndexes);

  function writeIndexes() {
    // TODO: html index building.
    console.log('writeIndexes called.');
  }
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
