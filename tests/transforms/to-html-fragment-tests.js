/* global __dirname */

var test = require('tape');
var fs = require('fs');
var StreamTestBed = require('through-stream-testbed');
var config = require('../../config');
var request = require('request');

var toHTMLFragment = require('../../transforms/to-html-fragment');

const videoBasePath = __dirname + '/../fixtures/videos/';

var cells = [
  {
    'tweetId': '849617236574826497',
    'caption': 'Tv2',
    'date': 'Wed Apr 05 13:38:28 +0000 2017',
    videoBufferInfo: {
      'bitrate': 832000,
      'content_type': 'video/mp4',
      'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/pbDLD37qZWDBGBHW.mp4'
    },
    postedToGit: true,
    videoFilename: 'pbDLD37qZWDBGBHW.mp4'
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
    postedToGit: true,
    videoFilename: 'DPL17ys0-inDTwQW.mp4'
  }
];

var expectedFragments = [
  '',
  ''
];

test(
  'Test toHTMLFragment',
  StreamTestBed({
    transformFn: toHTMLFragment,
    inputItems: cells,
    checkCollectedStreamOutput: checkHTMLFragments,
    checkOutputItem: checkHTMLFragment
  })
);

function checkHTMLFragments(t, resultCells) {
  t.equal(resultCells.length, cells.length, 'There is a cell result for each input cell.');
}

function checkHTMLFragment(t, cell, i) {
  t.equal(cell.htmlFragment, expectedFragments[i], 'The html fragment is correct.');
}
