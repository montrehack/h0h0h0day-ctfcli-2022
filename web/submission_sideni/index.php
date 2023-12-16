<?php
session_start();
require_once('lyrics.php');

// Avoid computing year day too many times
if (!isset($_SESSION['year_day']))
    $_SESSION['year_day'] = intval(shell_exec('/bin/date +%j'));

$cal = '/usr/bin/cal';
$ansi2html = '/usr/bin/ansi2html';
$tac = '/usr/bin/tac';
$sed = '/bin/sed';
$cat = '/bin/cat';
$echo = '/bin/echo';
$expr = '/usr/bin/expr';
$test = '/usr/bin/test';

$fct = "$cal -m 12";
$year = '2022';
$christmas = 359;
$bg = 'red';
$fg = 'green';

$day_of_christmas = 12 - ($christmas - $_SESSION['year_day']);
$merry = $day_of_christmas === 12;

if ($day_of_christmas >= 1 && $day_of_christmas <= 12) {
    $lyrics = lyric_for_nth_day($day_of_christmas);
} else {
    $lyrics = "It's not yet the most wonderful time of the year...";
}

if (isset($_REQUEST['year']) && is_numeric($_REQUEST['year']) && $_REQUEST['year'] > 0) {
    $year = intval($_REQUEST['year']);
    $fct .= " $year";
}

if (!empty($_REQUEST['christmas_spark']['bg']) && !empty($_REQUEST['christmas_spark']['fg'])){
    $bg = htmlspecialchars($_REQUEST['christmas_spark']['bg']);
    $fg = htmlspecialchars($_REQUEST['christmas_spark']['fg']);
}

$fct .= " | $ansi2html | $sed -e " . escapeshellarg('0,/^<body>$/d;s/_&#x232B;\\(.*\\)_&#x232B;\\([[:digit:]]\\+\\)/<span style="background-color:' . $fg . '; color:' . $bg . ';">\\1\\2<\\/span>/g');
$fct .= " | $tac | $sed '0,/^<\\/body>$/d' | $tac | { days=$($expr $((365 + $(($christmas - {$_SESSION['year_day']})))) % 365); if $test \$days -eq 0 ; then $echo \"<h1>MERRY CHRISTMAS !!!</h1>\"; else $echo \"<h1>Only \$days days until Christmas !!!</h1>\"; fi; $cat - ; }";

$calendar = shell_exec($fct);
$lyrics = nl2br($lyrics);
?>

<html>
<head>
<title>On the nth day of christmas...</title>
<style>
    body {
        background-color: <?php echo $bg; ?>;
        color: <?php echo $fg; ?>;
        text-align: center;
    }
    .column {
      float: center;
      width: 100%;
    }
    .row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    } 
    .row::after {
      content: "";
      clear: both;
      display: table;
    }

    #overlay {
      position: fixed;
      display: none;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 2;
      cursor: pointer;
    }

    .popover {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 50px;
      transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
      width: 20%;
      background: #fff;
      border-left: 1px solid rgb(0, 0, 0);
      -moz-box-shadow: 0 0 15px #ccc;
      -webkit-box-shadow: 0 0 15px #ccc;
      box-shadow: 0 0 15px #ccc;
      transition: all 0.3s ease-in;
    }
    .cookie-consent-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 2147483645;
      box-sizing: border-box;
      width: 100%;
    
      background-color: pink;
    }
    
    .cookie-consent-banner__inner {     
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 0;
    }
    
    .cookie-consent-banner__copy { 
      margin-bottom: 16px;
    }
    
    .cookie-consent-banner__actions {    
    }
    
    .cookie-consent-banner__header {
      margin-bottom: 8px;
      
      font-family: "CeraPRO-Bold", sans-serif, arial;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
    }
    
    .cookie-consent-banner__description {
      font-family: "CeraPRO-Regular", sans-serif, arial;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
    }
    
    .cookie-consent-banner__cta {
      box-sizing: border-box;
      display: inline-block;
      min-width: 164px;
      padding: 11px 13px;
        
      border-radius: 2px;
      
      background-color: red;
       
      color: green;
      text-decoration: none;
      text-align: center;
      font-family: "CeraPRO-Regular", sans-serif, arial;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;
    }
    
    .cookie-consent-banner__cta--secondary { 
      padding: 9px 13px;
      
      border: 2px solid #3A4649;
      
      background-color: transparent;
      
      color: red;
    }
    
    .cookie-consent-banner__cta:hover {
      background-color: darkred;
    }
    
    .cookie-consent-banner__cta--secondary:hover {
      border-color: #838F93;
        
      background-color: transparent;
      
      color: darkgreen;
    }
    
    .cookie-consent-banner__cta:last-child {
      margin-left: 16px;
    }
    .christmas-lights li {
        --christmas-lights-1: #057d70; /*color - 1*/
        --christmas-lights-2: #d41a21; /*color - 2*/
        --christmas-lights-3: #ffd27c; /*color - 3*/
        animation-duration: 2s;
        animation-fill-mode: both;
        animation-iteration-count: infinite;
        animation-name: flash-1;
        border-radius: 50%;
        display: inline-block;
        height: 20px;
        margin: 25px 20px;
        position: relative;
        width: 20px;
    }
      
    .christmas-lights {
        left: 0;
        margin: 0;
        pointer-events: none;
        position: fixed;
        right: 0;
        top: -15px;
        white-space: nowrap;
        width: 100%;
        z-index: 100;
    }
      
    .christmas-lights[data-position="bottom"] {
        top: auto;
        bottom: -15px;
        transform:scale(-1)
    }
      
    .christmas-lights[data-position="right"],
    .christmas-lights[data-position="left"] {
        transform: rotate(-90deg);
        left: -10px;
        top: 0;
        right: auto;
        bottom: 0;
        width: 100vh;
    }
      
    .christmas-lights[data-position="right"] {
        transform: rotate(90deg);
        left: auto;
        right: -15px;
    }
      
    .christmas-lights li:before {
        content: "";
        position: absolute;
        background: #505050;
        width: 10px;
        height: 10px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        top: -9px;
        left: 5px;
    }
      
    .christmas-lights li:after {
        content: "";
        top: -23px;
        left: 10px;
        position: absolute;
        width: 60px;
        height: 20px;
        border-bottom: solid #505050 2px;
        border-radius: 50%;
    }
      
    .christmas-lights li:last-child:after {
        content: none;
    }
      
    .christmas-lights li:first-child {
        margin-left: -40px;
    }
      
    .christmas-lights li:nth-child(2n+1) {
        background: var(--christmas-lights-1);
        box-shadow: 0px 5px 24px 3px rgb(249 212 129);
        animation-name: flash-2;
        animation-duration: 0.4s;
    }
      
    .christmas-lights li:nth-child(4n+2) {
        background: var(--christmas-lights-2);
        box-shadow: 0px 5px 24px 3px var(--christmas-lights-2);
        animation-name: flash-3;
        animation-duration: 1.1s;
    }
      
    .christmas-lights li:nth-child(odd) {
        animation-duration: 1.8s;
    }
      
    .christmas-lights li:nth-child(3n+1) {
          animation-duration: 1.4s;
    }
      
    @keyframes flash-1 {
        0%, 100% {
            background: var(--christmas-lights-1);
            box-shadow: 0px 5px 24px 3px var(--christmas-lights-1);
        }
        50% {
            background: var(--christmas-lights-2);
            box-shadow: 0px 5px 24px 3px var(--christmas-lights-2);
        }
    }
      
    @keyframes flash-2 {
        0%, 100% {
            background: var(--christmas-lights-2);
            box-shadow: 0px 5px 24px 3px var(--christmas-lights-2);
        }
        50% {
            background: var(--christmas-lights-3);
            box-shadow: 0px 5px 24px 3px var(--christmas-lights-3);
        }
    }
      
    @keyframes flash-3 {
        0%, 100% {
            background: var(--christmas-lights-3);
            box-shadow: 0px 5px 24px 3px var(--christmas-lights-3);
        }
        50% {
            background: var(--christmas-lights-1);
            box-shadow: 0px 5px 24px 3px var(--christmas-lights-1);
        }
    }
     
    @media (max-width: 1024px){
      .christmas-lights[data-position="left"] {
          left: -14px;
      }
     
      .christmas-lights[data-position="right"] {
          right: -14px;
      }
       
      .christmas-lights[data-position="left"],
      .christmas-lights[data-position="right"] {
        height: 100vh;
      }
    }
</style>
<script src="./sparkles.js"></script>
<script src="./PureSnow.js"></script>
<script src="./jquery-3.6.1.min.js"></script>
<link type="image/png" sizes="16x16" rel="icon" href="icons8-gift-16.png">
<link type="image/png" sizes="32x32" rel="icon" href="icons8-gift-32.png">
<link type="image/png" sizes="96x96" rel="icon" href="icons8-gift-96.png">
</head>
<body>
<img id="mouse_cursor" width="65px" height="65px" src="sleigh.png"/>
<div id="overlay" onclick="off()">
    <div class='popover'>
        <div class='popover-title'>
            <span class='title'>Hello there !</span><!-- General Kenobi ! -->
        </div>
        <div class='popover-content'>
            <div class='content-preview'>
                <img src="icons8-gift-color-96.png">
            </div>
        </div>
    </div>
</div>
<audio id="player" src="Twelve-Days-of-Christmas.mp3" loop></audio>
<?php echo $calendar;
echo '<hr/>';
if ($merry) {
    echo '<div class="row">
  <div class="column">
    <img src="merry1.gif" style="width:100%">
  </div>
  <div class="column">' . $lyrics . '</div>
  <div class="column">
    <img src="merry2.gif" style="width:100%">
  </div>
</div>';
} else {
    echo '<div class="row">
  <div class="column">
    <img src="not_yet1.gif" style="width:100%">
  </div>
  <div class="column">' . $lyrics . '</div>
  <div class="column">
    <img src="not_yet2.gif" style="width:100%">
  </div>
</div>';
}
?>

<div id='cookies' class="cookie-consent-banner">
  <div class="cookie-consent-banner__inner">
    <div class="cookie-consent-banner__copy">
      <div class="cookie-consent-banner__header">THIS WEBSITE USES COOKIES</div>
      <div class="cookie-consent-banner__description">We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with <b>Santa Claus, the elves, the reindeers and mostly Rudolph</b> who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services. You consent to our cookies if you continue to use our website.</div>
    </div>

    <div class="cookie-consent-banner__actions">
      <a href="#" onclick="fuck_off_cookies();" class="cookie-consent-banner__cta">
        OK
      </a>
      
      <a href="#" onclick="fuck_off_cookies();" class="cookie-consent-banner__cta cookie-consent-banner__cta--secondary">
        Decline
      </a>
    </div>
  </div>
</div>


</body>


<script>
document.getElementById("overlay").style.display = "block";

function fuck_off_cookies() {
    document.getElementById('cookies').style.display = "none";
}

function off() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById('player').play();
}
 $(document).ready(function(){
 		$('body').css('cursor', 'none');
    $(document).mousemove(function(e){
        $('#mouse_cursor').offset({left:e.pageX-40,top:e.pageY-40});    
    });
});

let christmas = {
    delay: null,
    delete: function(){
        document.body.querySelectorAll('.christmas-lights').forEach(function(ul){
            ul.remove();
        });
    },
    create: function(){
        let v = window.innerHeight / 60 + 2,
            h = window.innerWidth / 60 + 2,
            data = {
                'top': h,
                'right': v,
                'bottom': h,
                'left': v
            },
            ul = c = null;
        for (let position in data) {
            c = data[position];
            ul = document.createElement('ul');
            ul.className = 'christmas-lights';
            ul.dataset.position = position;
            for (let i = 0; i <= c; i++) {
                ul.append(document.createElement('li'));
            }
            document.body.append(ul);
        }
    }
}
 
document.addEventListener('DOMContentLoaded', function(){
    christmas.create();
});
 
window.addEventListener('resize', function(e) {
    clearTimeout(christmas.delay);
    christmas.delay = setTimeout(function(){
        christmas.delete();
        christmas.create();
    }, 100)
});
</script>
</html>
