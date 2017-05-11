var encoders = require('../base-64-encoders');
var defaults = require('lodash.defaults');
var cloneDeep = require('lodash.clonedeep');
var callNextTick = require('call-next-tick');
var establishLastPageIndex = require('../establish-last-page-index');
var GitHubFile = require('github-file');
var waterfall = require('async-waterfall');
var curry = require('lodash.curry');
var queue = require('d3-queue').queue;
var addCellsToPages = require('../add-cells-to-pages');

function AddCellsToPagesInGit(opts) {
  const metaDir = opts.metaDir;
  const lastPagePath = metaDir + '/last-page.txt';

  var githubFileForText = GitHubFile(
    defaults(
      cloneDeep(opts),
      {
        encodeInBase64: encoders.encodeTextInBase64,
        decodeFromBase64: encoders.decodeFromBase64ToText
      }
    )
  );

  return addCellsToPagesInGit;

  function addCellsToPagesInGit(cellToAdd, enc, addCellsDone) {
    var lastPageIndex;
    var updatedPagesPackage;

    // TODO: Think about rewriting as stream-like chain.
    waterfall(
      [
        curry(establishLastPageIndex)(githubFileForText, lastPagePath),
        saveLastPageIndex,
        getLastPage,
        addCells,
        updatePagesInGit,
        updateLastPageIndex,
        passResults
      ],
      addCellsDone
    );

    function saveLastPageIndex(theLastPageIndex, done) {
      lastPageIndex = theLastPageIndex;
      callNextTick(done);
    }

    function getLastPage(done) {
      githubFileForText.get(metaDir + '/' + lastPageIndex + '.json', decideOnGitResult);

      function decideOnGitResult(error, gitPackage) {
        if (error) {
          done(error);
        }
        else if (gitPackage.content) {
          done(null, JSON.parse(gitPackage.content));
        }
        else {
          done(null, []);
        }
      }
    }

    function addCells(lastPageCells, done) {
      updatedPagesPackage = addCellsToPages({
        currentLastPage: {index: lastPageIndex, cells: lastPageCells},
        cellsToAdd: [cellToAdd]
      });
      callNextTick(done);
    }

    function updatePagesInGit(done) {
      var q = queue(1);
      updatedPagesPackage.updatedPages.forEach(queuePageUpdate);
      q.awaitAll(done);

      function queuePageUpdate(page) {
        q.defer(updatePageInGit, page);
      }
    }

    function updatePageInGit(page, done) {
      var filePath = metaDir + '/' + page.index + '.json';

      githubFileForText.update(
        {
          filePath: filePath,
          content: JSON.stringify(page.cells)
        },
        passAfterSavingSHA
      );

      function passAfterSavingSHA(error, pageGitPackage) {
        // TODO: Save sha.
        setTimeout(passPageUpdatePackage, 0);

        function passPageUpdatePackage() {
          done(error, pageGitPackage);
        }
      }
    }

    function updateLastPageIndex(pagesGitPackages, done) {
      githubFileForText.update(
        {filePath: lastPagePath, content: '' + updatedPagesPackage.newLastPageIndex},
        done
      );
    }

    function passResults(done) {
      callNextTick(done, null, updatedPagesPackage);
    }
  }
}


module.exports = AddCellsToPagesInGit;
