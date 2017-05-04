var encoders = require('../base-64-encoders');
var defaults = require('lodash.defaults');
var cloneDeep = require('lodash.clonedeep');
var callNextTick = require('call-next-tick');
var GitHubFile = require('github-file');
var waterfall = require('async-waterfall');
var queue = require('d3-queue').queue;
var makeIndexHTMLFromPageSpec = require('../make-index-html-from-page-spec');
var sb = require('standard-bail')();
var template = require('../page-template');

function UpdateIndexHTMLInGit(opts) {
  const htmlDir = opts.htmlDir;

  var githubFileForText = GitHubFile(
    defaults(
      cloneDeep(opts),
      {
        encodeInBase64: encoders.encodeTextInBase64,
        decodeFromBase64: encoders.decodeFromBase64ToText
      }
    )
  );

  return updateIndexHTMLInGit;

  function updateIndexHTMLInGit(cell, enc, updateDone) {
    var stream = this;
    var htmlPackages = cell.updatedPages.map(makeIndexHTMLFromPage);

    var q = queue(1);
    htmlPackages.forEach(queueHTMLUpdate);
    q.awaitAll(sb(passResults, updateDone));

    function makeIndexHTMLFromPage(page) {
      return makeIndexHTMLFromPageSpec({
        mostRecentPageIndex: cell.newLastPageIndex,
        header: template.header, 
        footer: template.footer,
        pageSpec: page
      });
    }

    function queueHTMLUpdate(htmlPackage) {
      q.defer(updateGitWithPackage, htmlPackage);
    }

    function updateGitWithPackage(htmlPackage, done) {
      waterfall(
        [
          updateFileInGit,
          addIndexHTMLToCell
        ],
        done
      );

      function updateFileInGit(done) {
        githubFileForText.update(
          {
            filePath: htmlDir + '/' + htmlPackage.filename,
            content: htmlPackage.content
          },
          done
        );
      }

      function addIndexHTMLToCell(done) {
        if (!cell.indexesHTML) {
          cell.indexesHTML = [];
        }
        cell.indexesHTML.push(htmlPackage);
        callNextTick(done);
      }
    }

    function passResults() {
      stream.push(cell);
      updateDone();
    }
  }
}

module.exports = UpdateIndexHTMLInGit;
