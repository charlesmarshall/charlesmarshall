<?

$NEWSPAPERS = array(
  'http://www.bbc.co.uk/news/' => array('xpath'=>"//h2|//h3", 'name'=>"bbc-news", 'weight_map'=>array('h2'=>6, 'h3'=>5) )
   , 'http://www.telegraph.co.uk/' => array('xpath'=>"//h3|//h4", 'name'=>'telegraph', 'weight_map'=>array('h3'=>6, 'h4'=>5) )
   , 'http://www.thesun.co.uk/' => array('xpath'=>"//h2|//h3|//h4|//p[@class='header']", 'name'=>'sun' , 'weight_map'=>array('h2'=>6, 'h3'=>5, 'h4'=>4, 'p'=>3) )
);


?>