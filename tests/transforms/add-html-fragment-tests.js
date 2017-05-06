var test = require('tape');
var StreamTestBed = require('through-stream-testbed');

var addHTMLFragment = require('../../transforms/add-html-fragment');

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
  '<li class="video-pane">\n  <div class="video-time-stamp video-meta"><time datetime="2017-04-05T13:38:28.000Z">4/5/2017, 9:38:28 AM</time></div>\n  <video controls loop="true" preload="metadata" src="videos/pbDLD37qZWDBGBHW.mp4"></video>\n  <div class="video-caption video-meta">Tv2</div>\n</li>',
  '<li class="video-pane">\n  <div class="video-time-stamp video-meta"><time datetime="2017-04-05T13:37:45.000Z">4/5/2017, 9:37:45 AM</time></div>\n  <video controls loop="true" preload="metadata" src="videos/DPL17ys0-inDTwQW.mp4"></video>\n  <div class="video-caption video-meta"></div>\n</li>'
];

test(
  'Test addHTMLFragment',
  StreamTestBed({
    transformFn: addHTMLFragment,
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
