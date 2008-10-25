<?


class Flickr{

	private $api_key;
	private $api_secret_key;
	private $endpoint =  'http://www.flickr.com/services/rest/';
	private $auth_endpoint = 'http://www.flickr.com/services/auth/';
	public $error = false;
	public $error_details;
	public $raw_result;
	public $use_cache = true;
	public $method_in_use = "";
	/* aliased list for function calls */
	private $alias_list = array(
											'favourites'=> "flickr.favorites.getPublicList",
											'photos'=> "flickr.people.getPublicPhotos",
											'photo_sizes'=> "flickr.photos.getSizes",
											'pool_photos' => 'flickr.groups.pools.getPhotos',
											'photo_comments' => "flickr.photos.comments.getList",
											'photosets' => "flickr.photosets.getList",
											'photoset_photos' => 'flickr.photosets.getPhotos',
											'photoset_info' => "flickr.photosets.getInfo"
											);	
	
	public function __construct($api_key = false, $use_cache = false){
		if($api_key) $this->api_key = $api_key;
		$this->use_cache = $use_cache;
	}

	/* cool call function - dynamic functions! */
	public function __call($function, $args){
		if(method_exists($this, $function)) return $this->$function($args);
		//determine what type of function is being requested - (get)
		$pos		= strpos($function, "_");
		$type 	= substr($function, 0, $pos );
		$method = substr($function, $pos+1);
		$this->method_in_use = $method;
		if(method_exists($this, $type)) return $this->$type($method, $args[0], $args[1]);
		else return false;
	}

	protected function get($method, $args, $extra){	
		$original_method = $method;
		$keys = array_keys($this->alias_list);
		if(in_array($method, $keys)) $method = $this->alias_list[$method];
		else $method = str_replace("_", ".", $method);
		$url = $this->endpoint . "?method=".$method; 
		if($this->api_key) $url .= "&api_key=".$this->api_key;
		//create the url string
		foreach($args as $key => $value){
			$url .= "&".$key . "=".$value;
			$this->file_name[$key]= $key."-".$value;
		}		
		$xml = $this->fetch($url);
		if($xml->err){
			$this->error = true;
			foreach($xml->err->attributes() as $name => $value){
				$this->error_details[$name] = $value;
			}
			return false;
		} else{						
			$this->raw_result = $xml;	
			if(in_array($method, $this->alias_list)){
				$flipped = array_flip($this->alias_list);
				$function = "parse_result_of_".$flipped[$method];
			} else $function = "parse_result_of_".$original_method;

			if(method_exists($this, $function)) return $this->$function($xml, $extra);	
			else return $xml;
		}
	}	
	
	protected function parse_result_of_photos($xml, $null){
		$attr = (array) $xml->photos;
		$res=$this->parse_xml($xml, "photos");
		$res['@attributes'] = $attr['@attributes'];
		return $res;
	}
	protected function parse_result_of_photo_sizes($xml, $null){
		return $this->parse_xml($xml, "sizes", "size");
	}
	
	protected function parse_result_of_favourites($xml, $null){		
		return $this->parse_xml($xml, "photos");		
	}
	
	protected function parse_result_of_pool_photos($xml, $null){
		return $this->parse_xml($xml, "photos");
	}
	protected function parse_result_of_photo_comments($xml, $null){
		return $this->parse_xml($xml, "comments", "comment");
	}
	protected function parse_result_of_photosets($xml, $null){
		return $this->parse_xml($xml, "photosets", "photoset");
	}
	protected function parse_result_of_photoset_photos($xml, $null){
		return $this->parse_xml($xml, "photoset", "photo");
	}
	protected function parse_result_of_photoset_info($xml, $null){
		return (array) $xml->photoset->children();
	}
	
	protected function parse_xml($xml, $root_node, $child_node=false){		
		foreach($xml->$root_node->children() as $key => $child){
			if($child_node){
				$casted = (array) $child;
				$info[$child_node] = $casted;
			}
			foreach($child->attributes() as $k => $v){
				$info[$k] = (array) $v;
			}
			$details[] = $info;
		}
		return $details;
	}
	
	protected function fetch($url) {
		$extra_name = implode("_", $this->file_name);
		$file = $this->method_in_use . "_".$this->api_key . "_".$extra_name.".xml";
		if(!is_dir(WAX_ROOT."tmp/cache/")){
			@system("mkdir ".WAX_ROOT."cache/ && chmod 0777 ".WAX_ROOT."tmp/cache/");
		}
		$cache = WAX_ROOT."tmp/cache/".$file;
		/*check to see if cache should be deleted*/
		if(is_readable($cache)){
			$made_on = filemtime($cache);
			$now = time();
			$age = $now-$made_on;
			if($age > (60*60*24) ) unlink($cache);
		}		
		if(is_readable($cache) && $this->use_cache) return simplexml_load_file($cache, "SimpleXMLElement", LIBXML_NOCDATA|LIBXML_NOERROR );		
		else{
			$xmldoc = simplexml_load_file($url, "SimpleXMLElement", LIBXML_NOCDATA|LIBXML_NOERROR);
			if($this->use_cache) @file_put_contents(WAX_ROOT."tmp/cache/".$file, $xmldoc->asXML());
			return $xmldoc;
		}
  }
		
}
?>