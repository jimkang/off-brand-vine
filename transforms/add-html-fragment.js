var callNextTick = require('call-next-tick');

function addHTMLFragment(cell, enc, done) {
  var cellDate = new Date(cell.date);
  var formattedDate = cellDate.toISOString();
  var readableDate = cellDate.toLocaleString();

  cell.htmlFragment = `<li class="video-pane">
  <div class="video-time-stamp video-meta"><time datetime="${formattedDate}">${readableDate}</time></div>
  <video controls loop="true" preload="metadata" src="videos/${cell.videoFilename}"></video>
  <div class="video-caption video-meta">${cell.caption}</div>
</li>`;

  this.push(cell);
  callNextTick(done);
}

module.exports = addHTMLFragment;
