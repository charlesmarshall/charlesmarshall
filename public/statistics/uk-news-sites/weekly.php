<?
date_default_timezone_set('Europe/London');
include __DIR__. "/newspapers.php";

$year = date("Y");
$week = date("W");
$folder = __DIR__."/".$year."/".($week)."/";
echo "== WEEKLY ==\r\n";
echo " ".$year. " ".$week."\r\n";

function title_length($content, $COLOURS, $folder){
  echo "TITLE LENGTH\r\n";
  $weekly_word_length = array();
  foreach($content as $paper=>$data){
    $values = array();
    ksort($data['title_length']);
    //find total value to make this % based
    $total = 0;
    foreach($data['title_length'] as $count) $total+=$count;
    echo "   $paper : $total\r\n";
    foreach($data['title_length'] as $length=>$count){
      echo "     len:$length count:$count\r\n";
      $values[] = array('x'=>$length, 'y'=>$count);
    }
    $info = array('key'=>$paper, 'color'=>$COLOURS[$paper], 'values'=>$values);
    $weekly_word_length[] = $info;
  }
  file_put_contents($folder."title-length.json", json_encode($weekly_word_length));
}


function word_length($content, $COLOURS, $folder){
  echo " WORD LENGTH\r\n";
  $weekly_word_length = array();
  foreach($content as $paper=>$data){
    $values = array();
    ksort($data['word_length']);
    //find total value to make this % based
    $total = 0;
    foreach($data['word_length'] as $count) $total+=$count;
    echo "   $paper : $total\r\n";
    foreach($data['word_length'] as $length=>$count){
      $percentage = round($count / ($total/100),2);
      echo "     len:$length count:$count %:$percentage\r\n";
      $values[] = array('x'=>$length, 'y'=>$percentage);
    }
    $info = array('key'=>$paper, 'color'=>$COLOURS[$paper], 'values'=>$values);
    $weekly_word_length[] = $info;
  }
  file_put_contents($folder."word-length.json", json_encode($weekly_word_length));
}


$dir = new RecursiveIteratorIterator(new RecursiveRegexIterator(new RecursiveDirectoryIterator($folder, RecursiveDirectoryIterator::FOLLOW_SYMLINKS), '#(?<!/)\.json$|^[^\.]*$#i'), true);

$weekly = array();

foreach($dir as $file){
  $full = $file->getPathName();
  if(!is_dir($full) && $file->getFilename() == "totals.json"){
    $base = str_replace($folder, "", $full);
    $day = str_replace("/".$file->getFilename(), "", $base);
    $content = json_decode(file_get_contents($full),1);
    //word length
    word_length($content, $COLOURS, $folder);
    title_length($content, $COLOURS, $folder);

  }
}


//update main listing json
$year_weeks = array();
if(is_file(__DIR__."/listing.json")) $year_weeks = json_decode(file_get_contents(__DIR__."/listing.json"),1);
$year_weeks[$year][] = $week;
$year_weeks[$year] = array_unique($year_weeks[$year]);
file_put_contents(__DIR__."/listing.json", json_encode($year_weeks));

?>