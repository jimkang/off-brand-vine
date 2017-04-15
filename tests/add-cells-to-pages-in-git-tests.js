var test = require('tape');
var AddCellsToPagesInGit = require('../add-cells-to-pages-in-git');
var config = require('../config');
var request = require('request');
var randomId = require('idmaker').randomId;
var probable = require('probable');
var range = require('d3-array').range;
var assertNoError = require('assert-no-error');

var numberOfCells = probable.rollDie(20);

var cells = range(0, numberOfCells).map(createCell);

function createCell() {
  return {
    'tweetId': randomId(8),
    'caption': randomId(8),
    'date': (new Date()).toISOString(),
    videoFilename: randomId(4) + '.mp4'
  };
}

var addCellsToPagesInGit = AddCellsToPagesInGit({
  branch: 'master',
  gitRepoOwner: config.githubTest.gitRepoOwner,
  gitToken: config.githubTest.gitToken,
  repo: config.githubTest.repo,
  request: request,
  shouldSetUserAgent: true,
  metaDir: 'video/meta'
});

test(
  'Test adding ' + numberOfCells + ' cells to index in git',
  testAddCellsToPagesInGit
);

function testAddCellsToPagesInGit(t) {
  addCellsToPagesInGit(cells, checkGitResults);

  function checkGitResults(error, updatedPagesInfo) {
    assertNoError(t.ok, error, 'No error while adding cells to pages in git.');
    t.ok(!isNaN(updatedPagesInfo.newLastPageIndex), 'newLastPageIndex is a number.');
    t.ok(updatedPagesInfo.updatedPages.length > 0, 'There is at least one updated page.');
    console.log(updatedPagesInfo);
    console.log('Look at the repo to verify the correct updates were committed.');
    t.end();
  }
}
