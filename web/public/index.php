<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
  
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet">
  <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
  <?php include_once __DIR__ . '/api/src/helper/seo.php'; ?>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-SJDYC1X4C0"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'G-SJDYC1X4C0');
  </script>
</head>

<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <!-- <script type="text/javascript">
    atOptions = {
      'key': '0aa932d00816b5aaeb08895d708a5fda',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };
    document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/0aa932d00816b5aaeb08895d708a5fda/invoke.js"></scr' + 'ipt>');
  </script> -->
  <div id="root"></div>
  <!-- <script type="text/javascript">
    atOptions = {
      'key': '0aa932d00816b5aaeb08895d708a5fda',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };
    document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/0aa932d00816b5aaeb08895d708a5fda/invoke.js"></scr' + 'ipt>');
  </script> -->
  <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
</body>

</html>