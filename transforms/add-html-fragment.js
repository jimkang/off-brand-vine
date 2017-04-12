var callNextTick = require('call-next-tick');

function addHTMLFragment(cell, enc, done) {
  var formattedDate = (new Date(cell.date)).toISOString();

  cell.htmlFragment = `<li class="video-pane">
  <div class="video-time-stamp video-meta"><time datetime="${formattedDate}"</div>
  <video controls loop="true" preload="metadata" src="../lookit/videos/${cell.videoFilename}"></video>
  <div class="video-caption video-meta">${cell.caption}</div>
</li>`;

  this.push(cell);
  callNextTick(done);
}

module.exports = addHTMLFragment;
