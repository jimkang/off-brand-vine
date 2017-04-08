var getVideoFromTwitterTimeline = require('get-video-from-twitter-timeline');
var sb = require('standard-bail')();
var createVideoPostingStreamChain = require('./create-video-posting-stream-chain');

var config = require('./config');

var getOpts = {
  twitterCreds: config.twitter
  // TODO: Use "since this tweet" to not re-get stuff that's already been got.
};

getVideoFromTwitterTimeline(getOpts, sb(sendVideoToGit, logError));

function sendVideoToGit(tweetVideoPackages) {
  var videoPostingStreamChain = createVideoPostingStreamChain();
  tweetVideoPackages.forEach(writeToStream);
  videoPostingStreamChain.end();

  function writeToStream(tweetVideoPackage) {
    videoPostingStreamChain.write(tweetVideoPackage);
  }
}

function logError(error) {
  console.log(error);
}
