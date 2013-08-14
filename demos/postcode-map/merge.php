<?php

$string = '<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document><name>UK postcodes</name><description>Postcodes</description>';

foreach(glob("./kml/areas/*.kml") as $file){
  echo $file."..";
  $content = file_get_contents($file);
  $start = strpos($content, "<Folder>");
  $end = strpos($content, "</Folder>")+9;
  $string .= substr($content, $start, $end - $start);
  echo "\n";
}

$string .= "</Document>
</kml>";

file_put_contents("./kml/merged.kml", $string);
?>