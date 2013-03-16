<?
date_default_timezone_set('Europe/London');

include __DIR__. "/newspapers.php";
include __DIR__ ."/Scanner.php";
include __DIR__ ."/Headlines.php";

foreach($NEWSPAPERS as $paper=>$config){
  $h = new Headlines($paper, $config['xpath'], $config['name']);
  $h->get()->parse()->weighted()->html()->csv();
}

?>