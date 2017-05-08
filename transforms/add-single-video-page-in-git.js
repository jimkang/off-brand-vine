var encoders = require('../base-64-encoders');
var defaults = require('lodash.defaults');
var cloneDeep = require('lodash.clonedeep');
var callNextTick = require('call-next-tick');
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

    githubFileForText.update(
      {
        filePath: htmlDir + '/' + cellToAdd.tweetId + '.html',
        content: html
      },
      sb(passResults, addCellsDone)
    );

    function passResults() {
      cellToAdd.postedSingleVideoPage = true;
      callNextTick(addCellsDone, null, cellToAdd);
    }
  }
}

module.exports = AddSingleVideoPageInGit;
