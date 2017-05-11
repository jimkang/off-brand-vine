var encoders = require('../base-64-encoders');
var defaults = require('lodash.defaults');
var cloneDeep = require('lodash.clonedeep');
var GitHubFile = require('github-file');
var template = require('../page-template');
var sb = require('standard-bail')();

function AddSingleVideoPageInGit(opts) {
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

  return addSingleVideoPageInGit;

  function addSingleVideoPageInGit(cellToAdd, enc, addCellsDone) {
    var html = template.getHeader() + '\n'
      + cellToAdd.htmlFragment + '\n' +
      template.getFooter({previousIndexHTML: ''});

    var filePath = '';
    if (htmlDir) {
      filePath = htmlDir + '/';
    }
    filePath +=  cellToAdd.tweetId + '.html';

    githubFileForText.update(
      {
        filePath: filePath,
        content: html
      },
      sb(passResultsAfterDelay, addCellsDone)
    );

    function passResultsAfterDelay() {
      setTimeout(passResults, 1000);
    }

    function passResults() {
      cellToAdd.postedSingleVideoPage = true;
      addCellsDone(null, cellToAdd);
    }
  }
}

module.exports = AddSingleVideoPageInGit;
