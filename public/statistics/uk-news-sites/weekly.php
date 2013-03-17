<?
date_default_timezone_set('Europe/London');
$year = date("Y");
$week = date("W");

$folder = __DIR__."/".$year."/".($week)."/";

echo "== WEEKLY ==\r\n";
echo " ".$year. " ".$week."\r\n";

$dir = new RecursiveIteratorIterator(new RecursiveRegexIterator(new RecursiveDirectoryIterator($folder, RecursiveDirectoryIterator::FOLLOW_SYMLINKS), '#(?<!/)\.json$|^[^\.]*$#i'), true);

$weekly = array();

foreach($dir as $file){
  $full = $file->getPathName();
  if(!is_dir($full) && $file->getFilename() == "totals.json"){
    $base = str_replace($folder, "", $full);
    $day = str_replace("/".$file->getFilename(), "", $base);
    $content = json_decode(file_get_contents($full),1);

    $weekly[$year][$week][$day] = $content;
  }
}

file_put_contents($folder."weekly-totals.json", json_encode($weekly));

//update main listing json
$year_weeks = array();
if(is_file(__DIR__."/listing.json")) $year_weeks = json_decode(file_get_contents(__DIR__."/listing.json"),1);
$year_weeks[$year][] = $week;
$year_weeks[$year] = array_unique($year_weeks[$year]);
file_put_contents(__DIR__."/listing.json", json_encode($year_weeks));

?>