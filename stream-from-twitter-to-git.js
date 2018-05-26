// require('longjohn');

var StaticWebArchive = require('static-web-archive');
var boilTweetToVideo = require('boil-tweet-to-video');
var videoTweetToBuffer = require('./transforms/video-tweet-to-buffer');
var Twit = require('twit');
var sb = require('standard-bail')();

var config = require('./config');
var staticWebStream = StaticWebArchive({
  title: 'Lookit!',
  // footerHTML: `<div>Bottom of page</div>`,
  rootPath: 'tests/mock-root',
  // rootPath: '/usr/share/nginx/html/weblog',
  maxEntriesPerPage: 10,
  config
});
var twit = Twit(config.twitter);

var tweetStream = twit.stream('user', {with: 'user'});
tweetStream.on('tweet', postVideoFromTweet);
tweetStream.on('error', logError);

function postVideoFromTweet(incomingTweet) {
  var videoPackage = boilTweetToVideo(incomingTweet);
  if (videoPackage) {
    console.log('videoPackage', videoPackage);
    if (Array.isArray(videoPackage.videos) && videoPackage.videos.length > 0) {
      videoTweetToBuffer(videoPackage, null, sb(writeToWebStream, logError));
    }
  }
}

function writeToWebStream(videoPackageWithBuffer) {
  staticWebStream.write({
    id: videoPackageWithBuffer.tweetId,
    date: new Date(videoPackageWithBuffer.date),
    mediaFilename: videoPackageWithBuffer.videoFilename,
    caption: videoPackageWithBuffer.caption,
    altText: videoPackageWithBuffer.caption,
    buffer: videoPackageWithBuffer.buffer,
    isVideo: true
  });
}

function logError(error) {
  console.log(error);
}

