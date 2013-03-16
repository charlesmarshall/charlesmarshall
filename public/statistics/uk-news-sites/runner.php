<?
/**
  * Daily script to fetch data
  *
  */
date_default_timezone_set('Europe/London');

include __DIR__. "/newspapers.php";
include __DIR__ ."/Scanner.php";
include __DIR__ ."/Headlines.php";

$stats = array();
foreach($NEWSPAPERS as $paper=>$config){
  echo "==== $config[name] ====\r\n";
  $h = new Headlines($paper, $config['xpath'], $config['name'], $config['weight_map']);
  $stats[$paper] = $h->get()->parse()->weighted()->json()->stats();

}

$file = __DIR__."/".date("Y/W/w")."/totals.json";
$string = json_encode($stats);
file_put_contents($file, $string);


//title length, word length, popular words,
?>