// require('longjohn');

var StaticWebArchive = require('static-web-archive');
var boilTweetToMedia = require('./boil-tweet-to-media');
var videoTweetToBuffer = require('./transforms/video-tweet-to-buffer');
var imageTweetToBuffer = require('./transforms/image-tweet-to-buffer');
var Twit = require('twit');
var sb = require('standard-bail')();

var config = require('./config');
var staticWebStream = StaticWebArchive({
  title: 'Lookit!',
  // footerHTML: `<div>Bottom of page</div>`,
  // rootPath: 'tests/mock-root',
  rootPath: config.rootPath,
  maxEntriesPerPage: 10,
  config
});
var twit = Twit(config.twitter);

var tweetStream = twit.stream('user', { with: 'user' });
tweetStream.on('tweet', postMediaFromTweet);
tweetStream.on('error', logError);

function postMediaFromTweet(incomingTweet) {
  var mediaPackage = boilTweetToMedia(incomingTweet);
  if (mediaPackage) {
    console.log('mediaPackage', mediaPackage);
    if (mediaPackage.mediaType === 'video') {
      if (
        Array.isArray(mediaPackage.videos) &&
        mediaPackage.videos.length > 0
      ) {
        videoTweetToBuffer(mediaPackage, null, sb(writeToWebStream, logError));
      }
    } else if (mediaPackage.mediaType === 'image') {
      imageTweetToBuffer(mediaPackage, null, sb(writeToWebStream, logError));
    }
  }
}

function writeToWebStream(mediaPackageWithBuffer) {
  staticWebStream.write({
    id: mediaPackageWithBuffer.tweetId,
    date: new Date(mediaPackageWithBuffer.date),
    mediaFilename: mediaPackageWithBuffer.mediaFilename,
    caption: mediaPackageWithBuffer.caption,
    altText: mediaPackageWithBuffer.caption,
    buffer: mediaPackageWithBuffer.buffer,
    isVideo: mediaPackageWithBuffer.mediaType === 'video'
  });
}

function logError(error) {
  console.log(error);
}
