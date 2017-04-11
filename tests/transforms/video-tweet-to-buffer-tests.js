/* global Buffer, __dirname */

var test = require('tape');
var fs = require('fs');
var StreamTestBed = require('through-stream-testbed');

// This is a transform function that gets a video buffer, given an object containing a video url.
var videoTweetToBuffer = require('../../transforms/video-tweet-to-buffer');

var cells = [
  {
    'tweetId': '849617236574826497',
    'caption': 'Tv2',
    'date': 'Wed Apr 05 13:38:28 +0000 2017',
    'videos': [
      {
        'bitrate': 832000,
        'content_type': 'video/mp4',
        'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/pbDLD37qZWDBGBHW.mp4'
      },
      {
        'bitrate': 320000,
        'content_type': 'video/mp4',
        'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/caXUEKwOGdmqzFAR.mp4'
      },
      {
        'content_type': 'application/x-mpegURL',
        'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/2FUczq6u2kMIWzz9.m3u8'
      }
    ]
  },
  {
    'tweetId': '849617052130213888',
    'caption': '',
    'date': 'Wed Apr 05 13:37:45 +0000 2017',
    'videos': [
      {
        'content_type': 'application/x-mpegURL',
        'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/eWAuPEQksN7frQR9.m3u8'
      },
      {
        'bitrate': 832000,
        'content_type': 'video/mp4',
        'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/DPL17ys0-inDTwQW.mp4'
      },
      {
        'bitrate': 320000,
        'content_type': 'video/mp4',
        'url': 'http://jimkang.com/off-brand-vine/tests/fixtures/videos/7qhBfMtB60ZijShh.mp4'
      }
    ]
  }
];

test(
  'Test videoTweetToBufferStream',
  StreamTestBed({
    transformFn: videoTweetToBuffer,
    inputItems: cells,
    checkCollectedStreamOutput: checkObjectsContainingBuffers,
    checkOutputItem: checkObjectContainingBuffer
  })
);

function checkObjectsContainingBuffers(t, resultCells) {
  t.equal(resultCells.length, cells.length, 'There is a buffer object for each tweet.');
}

function checkObjectContainingBuffer(t, cell) {
  t.ok(cell.tweetId, 'There is a tweetId.');
  t.equal(typeof cell.caption, 'string', 'There is a caption.');
  t.ok(cell.date, 'There is a date.');
  t.equal(cell.videoBufferInfo.bitrate, 832000, 'The highest bitrate video was grabbed.');
  t.ok(Buffer.isBuffer(cell.buffer), 'The buffer is a Buffer.');
  t.ok(cell.buffer.length, 'The buffer is not empty.');
  var outputLocation = __dirname + '/../output/' + cell.tweetId + '.mp4';
  console.log('Writing result out to', outputLocation, 'Check it out visually.');
  fs.writeFileSync(outputLocation, cell.buffer);
}
