/* global process */

var getVideoFromTwitterTimeline = require('get-video-from-twitter-timeline');
var through2 = require('through2');
var videoTweetToBuffer = require('./transforms/video-tweet-to-buffer');
var BufferToGit = require('./transforms/buffer-to-git');
var request = require('request');
var sb = require('standard-bail')();
var ndjson = require('ndjson');

var config = require('./config');

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

var getOpts = {
  twitterCreds: config.twitter
  // TODO: Use "since this tweet" to not re-get stuff that's already been got.
};

getVideoFromTwitterTimeline(getOpts, sb(sendVideoToGit, logError));

function sendVideoToGit(tweetVideoPackages) {
  var videoPackToBufferStream = createStreamWithTransform(
    videoTweetToBuffer, logError
  );
  var bufferToGitStream = createStreamWithTransform(bufferToGit, logError);

  videoPackToBufferStream
    .pipe(bufferToGitStream)
    .pipe(ndjson.stringify())
    .pipe(process.stdout);

  tweetVideoPackages.forEach(writeToStream);
  videoPackToBufferStream.end();

  function writeToStream(tweetVideoPackage) {
    videoPackToBufferStream.write(tweetVideoPackage);
  }
}

function createStreamWithTransform(transform, errorCallback) {
  var stream = through2({objectMode: true}, transform);
  stream.on('error', errorCallback);
  return stream;
}

function logError(error) {
  console.log(error);
}