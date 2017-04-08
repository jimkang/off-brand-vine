var GitHubFile = require('github-file');
var sb = require('standard-bail')();

function BufferToGit(opts) {
  opts.encodeInBase64 = encodeInBase64;
  var githubFile = GitHubFile(opts);

  return bufferToGit;

  function bufferToGit(bufferPackage, enc, done) {
    githubFile.update(
      {
        filePath: 'videos/' + getFilename(bufferPackage.videoBufferInfo.url),
        content: bufferPackage.buffer,
        message: 'off-brand-vine posting video'
      },
      sb(passPackage, done)
    );

    function passPackage() {
      bufferPackage.postedToGit = true;
      done(null, bufferPackage);
    }
  }
}

function getFilename(url) {
  var parts = url.split('/');
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }
}

function encodeInBase64(buffer) {
  return buffer.toString('base64');
}

module.exports = BufferToGit;
