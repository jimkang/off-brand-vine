var pluck = require('lodash.pluck');

function makeIndexHTMLFromPageSpec({
    mostRecentPageIndex,
    header,
    footer,
    pageSpec
  }) {

  var filename = pageSpec.index + '.html';
  if (pageSpec.index === mostRecentPageIndex)   {
    filename = 'index.html';
  }
  return {
    filename: filename,
    content: header + '\n' +
      pluck(pageSpec.cells, 'htmlFragment').join('\n') + '\n' +
      footer + '\n'
  };
}

module.exports = makeIndexHTMLFromPageSpec;
