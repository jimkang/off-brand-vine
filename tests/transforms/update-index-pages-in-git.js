var test = require('tape');
var StreamTestBed = require('through-stream-testbed');
var UpdateIndexPagesInGit = require('../../transforms/update-index-pages-in-git');
var config = require('../../config');
var request = require('request');
var randomId = require('idmaker').randomId;
var probable = require('probable');
var range = require('d3-array').range;

var numberOfCells = probable.rollDie(6);

var cells = range(0, numberOfCells).map(createCell);

function createCell() {
  return {
    'tweetId': randomId(8),
    'caption': randomId(8),
    'date': (new Date()).toISOString(),
    videoFilename: randomId(4) + '.mp4'
  };
}

var updateIndexPagesInGit = UpdateIndexPagesInGit({
  branch: 'master',
  gitRepoOwner: config.githubTest.gitRepoOwner,
  gitToken: config.githubTest.gitToken,
  repo: config.githubTest.repo,
  request: request,
  shouldSetUserAgent: true,
  metaDir: 'video/meta'
});

test(
  'Test creating index pages for ' + numberOfCells + ' cells to index in git',
  StreamTestBed({
    transformFn: updateIndexPagesInGit,
    inputItems: cells,
    checkCollectedStreamOutput: checkGitResults,
    checkOutputItem: checkGitResult
  })
);

function checkGitResults(t, resultCells) {
  t.equal(resultCells.length, cells.length, 'There is a git result object for each cell.');
  console.log('Look at the repo to verify the correct updates were committed.');
}

function checkGitResult(t, updatedPagesInfo) {
  t.ok(!isNaN(updatedPagesInfo.newLastPageIndex), 'newLastPageIndex is a number.');
  t.ok(updatedPagesInfo.updatedPages.length > 0, 'There is at least one updated page.');
  // console.log(updatedPagesInfo);
}
