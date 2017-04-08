var createVideoPostingStreamChain = require('./create-video-posting-stream-chain');
var boilTweetToVideo = require('boil-tweet-to-video');
var Twit = require('twit');

var config = require('./config');

var videoPostingStreamChain = createVideoPostingStreamChain();
var twit = Twit(config.twitter);

var tweetStream = twit.stream('user', {with: 'user'});
tweetStream.on('tweet', postVideoFromTweet);
tweetStream.on('error', logError);

function postVideoFromTweet(incomingTweet) {
  var videoPackage = boilTweetToVideo(incomingTweet);
  if (videoPackage) {
    videoPostingStreamChain.write(videoPackage);
  }
}

function logError(error) {
  console.log(error);
}
