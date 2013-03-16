<?

class Headlines{

  public $newspaper;
  public $scanner;
  public $h = array();
  public $weight = 7; //h6 is max... so value of header is 7 - h
  public $weighted = array();
  public $occurances = array();

  public function __construct($newspaper, $xpath=false, $name){
    $this->newspaper = $newspaper;
    $this->xpath = $xpath;
    $this->name = $name;
  }

  public function get(){
    $this->scanner = new Scanner(array('url'=>$this->newspaper));
    $this->raw_content = $this->scanner->fetch()->content;
    return $this;
  }

  public function parse(){
    $segment = $this->raw_content;
    $dom = new DOMDocument;
    @$dom->loadHTML($this->raw_content);
    $xpath = new DOMXPath($dom);

    foreach($xpath->query($this->xpath) as $item){
      $h = str_replace("h", "",$item->tagName);
      $this->h[$h][] = str_replace("\n", "", str_replace("\r\n", "", trim($item->textContent)));
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
              @$this->weighted[$word]+= $this->weight - $h;
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



}

?>