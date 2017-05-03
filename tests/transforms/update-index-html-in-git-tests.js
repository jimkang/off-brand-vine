var test = require('tape');
var StreamTestBed = require('through-stream-testbed');
var UpdateIndexHTMLInGit = require('../../transforms/update-index-html-in-git');
var config = require('../../config');
var request = require('request');

var cells = [
  {
    newLastPageIndex: 0,
    updatedPages: [
      {
        index: 0,
        cells: [
          {
            date: '2017-04-18T13:34:01.000Z',
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:34:01.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/34U_5EzYg4Bvy88n.mp4\'></video>\n  <div class=\'video-caption video-meta\'></div>\n</li>'
          },
          {
            date: '22017-04-18T13:42:24.000Z',
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:42:24.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/QBytlk6nvVUhhrT1.mp4\'></video>\n  <div class=\'video-caption video-meta\'>Short protestor</div>\n</li>'
          }
        ]
      }
    ]
  },

  {
    newLastPageIndex: 1,
    updatedPages: [
      {
        index: 1,
        cells: [
          {
            date: '2017-04-18T21:33:38.000Z',
            htmlFragment: '<li class=\"video-pane\">\n  <div class=\"video-time-stamp video-meta\"><time datetime=\"2017-04-18T21:33:38.000Z\"</div>\n  <video controls loop=\"true\" preload=\"metadata\" src=\"../lookit/videos/ik17VrjkklDF-Q19.mp4\"></video>\n  <div class=\"video-caption video-meta\">Christmas in April</div>\n</li>'
          }
        ]
      },
      {
        index: 0,      
        cells: [
          {
            date: '2017-04-18T13:26:20.000Z',
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:26:20.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/undefined\'></video>\n  <div class=\'video-caption video-meta\'>Not how mashups are made, guy.</div>\n</li>'
          },
          {
            date: '2017-04-18T13:34:01.000Z',
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:34:01.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/34U_5EzYg4Bvy88n.mp4\'></video>\n  <div class=\'video-caption video-meta\'></div>\n</li>'
          },
          {
            date: '2017-04-18T13:42:24.000Z',
            'htmlFragment': '<li class=\'video-pane\'>\n  <div class=\'video-time-stamp video-meta\'><time datetime=\'2017-04-18T13:42:24.000Z\'</div>\n  <video controls loop=\'true\' preload=\'metadata\' src=\'../lookit/videos/QBytlk6nvVUhhrT1.mp4\'></video>\n  <div class=\'video-caption video-meta\'>Short protestor</div>\n</li>'
          }
        ]
      }
    ]
  },
];

var updateIndexHTMLInGit = UpdateIndexHTMLInGit({
  branch: 'master',
  gitRepoOwner: config.githubTest.gitRepoOwner,
  gitToken: config.githubTest.gitToken,
  repo: config.githubTest.repo,
  request: request,
  shouldSetUserAgent: true,
  metaDir: 'video/meta'
});

test(
  'Test creating index pages for cells to index in git',
  StreamTestBed({
    transformFn: updateIndexHTMLInGit,
    inputItems: cells,
    checkCollectedStreamOutput: checkGitResults,
    checkOutputItem: checkGitResult
  })
);

function checkGitResults(t, resultCells) {
  t.equal(resultCells.length, cells.length, 'There is a git result object for each cell.');
  console.log('Look at the repo to verify the correct updates were committed.');
}

function checkGitResult(t, resultCell) {
  t.ok(resultCell.indexesHTML.length > 0, 'There is at least one index html.');
  console.log(resultCell.indexesHTML);
}
