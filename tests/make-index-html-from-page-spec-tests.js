var test = require('tape');
var makeIndexHTMLFromPageSpec = require('../make-index-html-from-page-spec');

var testCases = [
  {
    opts: {
      mostRecentPageIndex: 0,
      header: '<ul>',
      footer: '</ul>',
      pageSpec: {
        index: 0,
        cells: [
          {
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:34:01.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/34U_5EzYg4Bvy88n.mp4\'></video>\n  <div class=\'video-caption video-meta\'></div>\n</li>'
          },
          {
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:42:24.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/QBytlk6nvVUhhrT1.mp4\'></video>\n  <div class=\'video-caption video-meta\'>Short protestor</div>\n</li>'
          }
        ]
      }
    },
    expected: {
      filename: 'index.html',
      content: '<ul>\n<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:34:01.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/34U_5EzYg4Bvy88n.mp4\'></video>\n  <div class=\'video-caption video-meta\'></div>\n</li>\n<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:42:24.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/QBytlk6nvVUhhrT1.mp4\'></video>\n  <div class=\'video-caption video-meta\'>Short protestor</div>\n</li>\n</ul>\n'
    }
  },

  {
    opts: {
      mostRecentPageIndex: 1,
      header: '<body><ul>',
      footer: '</ul></body>',    
      pageSpec: {
        index: 0,      
        cells: [
          {
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:26:20.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/undefined\'></video>\n  <div class=\'video-caption video-meta\'>Not how mashups are made, guy.</div>\n</li>'
          },
          {
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:34:01.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/34U_5EzYg4Bvy88n.mp4\'></video>\n  <div class=\'video-caption video-meta\'></div>\n</li>'
          },
          {
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:42:24.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/QBytlk6nvVUhhrT1.mp4\'></video>\n  <div class=\'video-caption video-meta\'>Short protestor</div>\n</li>'
          }
        ]
      }
    },
    expected: {
      filename: '0.html',
      content: '<body><ul>\n<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:26:20.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/undefined\'></video>\n  <div class=\'video-caption video-meta\'>Not how mashups are made, guy.</div>\n</li>\n<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:34:01.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/34U_5EzYg4Bvy88n.mp4\'></video>\n  <div class=\'video-caption video-meta\'></div>\n</li>\n<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:42:24.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/QBytlk6nvVUhhrT1.mp4\'></video>\n  <div class=\'video-caption video-meta\'>Short protestor</div>\n</li>\n</ul></body>\n'
    }
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test('Make index html file', makeIndexHTMLTest);

  function makeIndexHTMLTest(t) {
    t.deepEqual(
      makeIndexHTMLFromPageSpec(testCase.opts),
      testCase.expected,
      'Correct html and filename are generated.'
    );
    t.end();
  }
}
