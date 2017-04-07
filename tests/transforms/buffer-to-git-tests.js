/* global Buffer, __dirname */

var test = require('tape');
var fs = require('fs');
var StreamTestBed = require('through-stream-testbed');
var config = require('../../config');
var request = require('request');

// This is a transform function that gets a video buffer, given an object containing a video url.
var BufferToGit = require('../../transforms/buffer-to-git');

const videoBasePath = __dirname + '/../fixtures/videos/';

var bufferPackages = [
  {
    'tweetId': '849617236574826497',
    'caption': 'Tv2',
    'date': 'Wed Apr 05 13:38:28 +0000 2017',
    videoBufferInfo: {
      'bitrate': 832000,
      'content_type': 'video/mp4',
      'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/pbDLD37qZWDBGBHW.mp4'
    },
    buffer: fs.readFileSync(videoBasePath + 'pbDLD37qZWDBGBHW.mp4')
  },
  {
    'tweetId': '849617052130213888',
    'caption': '',
    'date': 'Wed Apr 05 13:37:45 +0000 2017',
    videoBufferInfo: {
      'bitrate': 832000,
      'content_type': 'video/mp4',
      'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/DPL17ys0-inDTwQW.mp4'
    },
    buffer: fs.readFileSync(videoBasePath + 'DPL17ys0-inDTwQW.mp4')
  }
];

var bufferToGit = BufferToGit({
  branch: 'master',
  gitRepoOwner: config.githubTest.gitRepoOwner,
  gitToken: config.githubTest.gitToken,
  repo: config.githubTest.repo,
  request: request  
});

test(
  'Test bufferToGit',
  StreamTestBed({
    transformFn: bufferToGit,
    inputItems: bufferPackages,
    checkCollectedStreamOutput: checkGitResults,
    checkOutputItem: checkGitResult
  })
);

function checkGitResults(t, items) {
  t.equal(items.length, bufferPackages.length, 'There is a git result object for each buffer object.');
}

function checkGitResult(t, item) {
  t.ok(item.tweetId, 'There is a tweetId.');
  t.equal(typeof item.caption, 'string', 'There is a caption.');
  t.ok(item.date, 'There is a date.');
  t.ok(item.sha, 'There is a SHA for the git commit.');
}
