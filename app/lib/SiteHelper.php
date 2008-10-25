<?
class SiteHelper extends WXHelpers {
  	
	public function short_date($date){
		return date("jS M y", strtotime($date));
	}
	public function long_date($date){
		return date("nS F Y", strtotime($date));
	}	
	
	public function parse_rss_string($string, $items) {
		$simple = @simplexml_load_string($string, "SimpleXMLElement");
		$i = 0;
    foreach($simple->channel->item as $data){
			foreach($data->children() as $field => $item){
				$value = (array)$item;
				$rss[$i][$field] = str_replace("–", "~",$value[0]);
			}
			$i++;
		}

    if(is_array($rss) && count($rss)>0) return array_slice($rss, 0, $items);
		else return array();
  }

	public function improved_parse_rss($url, $items) {
    $simple = @simplexml_load_file($url, "SimpleXMLElement", LIBXML_NOCDATA|LIBXML_NOERROR);
    for($i=0; $i<$items; $i+=1) {
      $title = (array) $simple->channel->item[$i]->title;
      $desc = (array) $simple->channel->item[$i]->description;
      $link = (array) $simple->channel->item[$i]->link;
      $pubdate= (array) $simple->channel->item[$i]->pubDate;
      $rss[]=array($title[0], $desc[0], $link[0], $pubdate[0]);
    }
    return $rss;
  }
	
	public function flickr_photo($pic_id, $sizes, $no_image_path="/images/no-pic.gif", $sync=true){
			if(!is_array($sizes)) return "";
			$data = array();
			$files = array();
			foreach($sizes as $size){
				$index = $size['label'][0];
				$files[$index] = $size['source'][0];
			}											
			if(!is_dir(PUBLIC_DIR . "files/flickr/")) mkdir(PUBLIC_DIR . "files/flickr/");
			$dir = PUBLIC_DIR . "files/flickr/".$pic_id."/";
			$web_dir = "/files/flickr/".$pic_id."/";
			if(!is_dir($dir)) mkdir($dir);
			
			foreach($files as $k => $file_to_get){
				$save_to = $pic_id.substr($file_to_get, -6);
				
				if(is_readable($dir.$save_to)) $data[$k] = $web_dir.$save_to;
				else{
					$result = self::get_remote_file($file_to_get);
					if($result){
						file_put_contents($dir.$save_to, $result);
						$data[$k] =  $web_dir.$save_to;
					}else $data[$k] = $no_image_path;
				}
			}
			system('chmod -Rf 0777 '.$dir);
			if($sync){
				$fs = new CmsFilesystem;
	      $rel = $web_dir;
	      $fs->databaseSync($dir, $rel);
			}
			
			return $data;		
	}
	
	public function get_remote_file($file_url){
		$session = curl_init($file_url);
    curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($session, CURLOPT_FOLLOWLOCATION, 1);
		$exec = curl_exec($session);		
		$info = curl_getInfo($session);
		if($info['http_code'] == 200) return $exec;
		else return false;
	}

} // END class 

