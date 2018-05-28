var sb = require('standard-bail')();
var cloneDeep = require('lodash.clonedeep');
var { getBuffer, getFilename } = require('../get-stuff');

function imageTweetToBuffer(cell, enc, done) {
  getBuffer(cell.imageURL, sb(pushBufferPackage, done));

  function pushBufferPackage(buffer) {
    var newCell = cloneDeep(cell);
    newCell.buffer = buffer;
    newCell.mediaFilename = getFilename(newCell.imageURL);
    done(null, newCell);
  }
}

module.exports = imageTweetToBuffer;
