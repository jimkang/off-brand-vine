const pageHeader = `<html>
<head>
  <title>Lookit!</title>
  <link rel="stylesheet" href="../app.css"></link>
  <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
</head>
<body>

<div class="annotation hidden warning">
</div>

<h1>Lookit: My bideo!</h1>

<section class="videos">
  <ul class="video-list">`;

const pageFooter = `</ul>
</section>

</body>
</html>`;

module.exports = {
  header: pageHeader,
  footer: pageFooter
};
