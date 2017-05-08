function getHeader() {
  return `<html>
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
}

function getFooter({previousIndexHTML}) {
  return `</ul>
  </section>

  <div class="previous-indexes">${previousIndexHTML}</div>

  <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-98704896-1', 'auto');
  ga('send', 'pageview');

  </script>

  </body>
  </html>`;
}

module.exports = {
  getHeader: getHeader,
  getFooter: getFooter
};
