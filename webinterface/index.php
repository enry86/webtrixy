<?php
session_start ();
$id = session_id ();
$_SESSION['gameid'] = $id;
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>Trixy Home on the Web</title>
    <script src="js/closure/base.js"></script>
    <script src="js/connectFour.compiled.js"></script>
    <link rel="stylesheet" href="css/style.css"/>
  </head>
  <body>
    <header>
      <h1>TrixyWeb</h1>
    </header>
    <article>
      <h1>Connect Four</h1>
      <canvas id="connect-four">
      </canvas>
      <p id="results-box"></p>
    </article>
    <script type="text/javascript">
      initBoard("connect-four", "results-box");
    </script>
  </body>
</html>
