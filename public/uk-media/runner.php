<?
date_default_timezone_set('Europe/London');

include __DIR__. "/newspapers.php";
include __DIR__ ."/Scanner.php";
include __DIR__ ."/Headlines.php";

$stats = array();
foreach($NEWSPAPERS as $paper=>$config){
  echo "==== $config[name] ====\r\n";
  $h = new Headlines($paper, $config['xpath'], $config['name'], $config['weight_map']);
  $stats[$paper] = $h->get()->parse()->weighted()->stats();

}
print_r($stats);

//meta information about today
//most popular words overall
//title length distibution - per & overall
//word length distribution - per & overall
//



//title length, word length, popular words,
?>