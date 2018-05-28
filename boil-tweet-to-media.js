var pathExists = require('object-path-exists');

var shortenedTwitterLinkWithLeadingSpaceRegex = /\s?https:\/\/t.co\/[\w\d]+/g;

var mediaPath = ['extended_entities', 'media', '0'];
var videoVariantsPath = [
  'extended_entities',
  'media',
  '0',
  'video_info',
  'variants'
];

function boilTweetToMedia(tweet) {
  var boiled = {
    tweetId: tweet.id_str,
    caption: tweet.text.replace(shortenedTwitterLinkWithLeadingSpaceRegex, ''),
    date: tweet.created_at
  };

  if (pathExists(tweet, mediaPath)) {
    let firstMedia = tweet.extended_entities.media[0];
    if (pathExists(tweet, videoVariantsPath)) {
      boiled.videos = firstMedia.video_info.variants;
      boiled.mediaType = 'video';
      return boiled;
    } else if (firstMedia.type === 'photo') {
      boiled.imageURL = firstMedia.media_url;
      boiled.mediaType = 'image';
      return boiled;
    }
  }
}

module.exports = boilTweetToMedia;
