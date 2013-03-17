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
echo "== DAILY ==\r\n";
foreach($NEWSPAPERS as $paper=>$config){
  echo "  $config[name] \r\n";
  $h = new Headlines($paper, $config['xpath'], $config['name'], $config['weight_map']);
  $stats[$config['name']] = $h->get()->parse()->weighted()->json()->stats();

}

$file = __DIR__."/".date("Y/W/w")."/totals.json";
$string = json_encode($stats);
file_put_contents($file, $string);


if(date("w") == 6){
  $cmd = "/usr/local/opt/php54/bin/php ".__DIR__."/weekly.php";
  echo " == WEEKLY ==\r\n";
  exec($cmd);
}

?>