<?

class Headlines{

  public $newspaper;
  public $scanner;
  public $h = array();
  public $weighted = array();
  public $occurances = array();

  public function __construct($newspaper, $xpath=false, $name, $weight_map = array()){
    $this->newspaper = $newspaper;
    $this->xpath = $xpath;
    $this->name = $name;
    $this->weight_map = $weight_map;
  }

  public function get(){
    $this->scanner = new Scanner(array('url'=>$this->newspaper));
    $this->raw_content = $this->scanner->fetch()->content;
    return $this;
  }

  public function tidy($item){
    $content = strtolower(str_replace("'", "", str_replace("\n", "", str_replace("\r\n", "", trim($item->textContent)))));
    preg_replace("#'[^A-Za-z0-9 ]#i", "", $content);
    return $content;
  }

  public function weight($tag){
    return ($this->weight_map[$tag]) ? $this->weight_map[$tag] :  1;
  }

  public function parse(){
    $dom = new DOMDocument;
    @$dom->loadHTML($this->raw_content);
    $xpath = new DOMXPath($dom);

    foreach($xpath->query($this->xpath) as $item){
      $h = $item->tagName;
      $this->h[$h][] = $this->tidy($item);
    }
    return $this;
  }

  public function weighted(){
    foreach($this->h as $h=>$titles){
      foreach($titles as $title){
        $words = preg_split("/[\s,]+/", $title);
        //only count if more than one word in the title
        if(count($words) > 1){
          foreach($words as $word){
            if($word){
              @$this->weighted[$word]+= $this->weight($h);
              @$this->occurances[$word] ++;
            }
          }
        }
      }
    }
    array_multisort($this->weighted, SORT_DESC, SORT_NUMERIC);
    array_multisort($this->occurances, SORT_DESC, SORT_NUMERIC);
    return $this;
  }

  public function html(){
    $dir = __DIR__ ."/".date("Ymd");
    if(!is_dir($dir)) mkdir($dir, 0777, true);

    $table = "<table><thead><tr><td></td><th>Weighted</th><th>Occurances</th></tr></thead><tbody>";
    foreach(array_keys($this->weighted) as $word){
      $table .= "<tr><th>".$word."</th><td>".$this->weighted[$word]."</td><td>".$this->occurances[$word]."</td></tr>";
    }
    $table .= "</tbody></table>";
    file_put_contents($dir."/".$this->name.".html", $table);
    return $this;
  }

  public function csv(){
    $dir = __DIR__ ."/".date("Ymd");
    if(!is_dir($dir)) mkdir($dir, 0777, true);
    $file = fopen($dir."/".$this->name.".csv", "w+");
    fputcsv($file, array('word', 'weighted', 'occurances'));
    foreach(array_keys($this->weighted) as $word){
      fputcsv($file, array($word, $this->weighted[$word], $this->occurances[$word]));
    }
    fclose($file);
    return $this;
  }


  public function json(){
    $dir = __DIR__ ."/".date("Ymd");
    if(!is_dir($dir)) mkdir($dir, 0777, true);
    $parse = array();
    foreach(array_keys($this->weighted) as $word) $parse[$word] = array('weighted'=>$this->weighted[$word], 'occurances'=>$this->occurances[$word] );
    $string = json_encode($parse);
    file_put_contents($dir."/".$this->name.".json", $string);
    return $this;
  }


  public function stats(){
    $stats = array();
    //word length
    foreach(array_keys($this->weighted) as $word) @$stats['word_length'][strlen($word)] ++;
    //title length
    foreach($this->h as $titles){
      foreach($titles as $title){
        $count = count(preg_split("/[\s,]+/", $title));
        if($count > 1) @$stats['title_length'][$count]++;
      }
    }
    //popular words
    $this->stats = $stats;
    $use = array_slice(array_keys($this->weighted),0,10);
    foreach($use as $word) $this->stats['popular_words'][$word] = array('word'=>$word,'weighted'=>$this->weighted[$word], 'occurances'=>$this->occurances[$word] );
    //popular, but excluding words like 'the', 'of' etc


    asort($this->stats['word_length'], SORT_NUMERIC);
    asort($this->stats['title_length'], SORT_NUMERIC);
    return $this->stats;
  }


}

?>