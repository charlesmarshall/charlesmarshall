<?php

class PageController extends ApplicationController {

	public $this_page = 1;
	public $per_page = 10;
	
	public function controller_global(){
		parent::cms();
		$this->body_id = parent::get_body_id();
		$this->body_class = parent::get_body_class();	
	}
  
  public function index() {
    $model = new CmsContent("published");
		$this->cms_content[0] = $model->filter(array('cms_section_id'=>3))->order('published DESC')->first();
  }
  

	public function related(){
		$this->use_layout = false;
		$this->use_view ="_related";
		if(Request::post('page_number') && Request::post('section') ){
			$page = parse_url(Request::post('page_number'));
			$page = str_replace("page=","",$page['query']);
			if($page && Request::post('section')){
				$this->this_page = $page;
				$section = new CmsSection;
				$content = new CmsContent("published");
				$this->cms_section = $section->filter(array('url'=>Request::post('section') ))->first();
				if($this->cms_section->id){
					$this->cms_section_id = $this->cms_section->id;
					$this->cms_content = $content->filter(array('cms_section_id'=>$this->cms_section_id))->order('published DESC')->page($this->this_page,$this->per_page);
				}
			}
		}		
	}


	public function oneblackbear() {
    $this->use_layout = false;
    if(!cache_valid("obb/cmmarshall" )){
			$this->rss  = improved_parse_rss("http://www.oneblackbear.com/feed/", 5);
      if(!is_array($this->rss)){
        cache_reset("obb/cmmarshall");
        $this->use_view = false;
      }
    }
  }

	public function lastfm() {
    $this->use_layout = false;
    if(!cache_valid("lastfm/cmmarshall" )){
			$xml = $this->get_url("http://ws.audioscrobbler.com/1.0/user/cmmarshall/recenttracks.rss");
			if($xml) $this->lastfm  = parse_rss_string($xml, 12);
      if(!is_array($this->lastfm)){
        cache_reset("lastfm/cmmarshall");
        $this->use_view = false;
      }
    }
  }

	public function twitter() {
    $this->use_layout = false;
    if(!cache_valid("twitter/charlesmarshall" )){   
			$xml = $this->get_xml("http://twitter.com/statuses/user_timeline/15094632.xml");
      if($xml) $this->twitter = $xml->xpath("status[position() < 6]");
      if(!is_array($this->twitter)){
        cache_reset("twitter/charlesmarshall");
        $this->use_view = false;
      }
    }
  }


	protected function get_url($url, $useragent = false) {
    $ch = curl_init();
    if($useragent) curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_FAILONERROR, TRUE);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    $response = curl_exec($ch);
    if(!$response) return false;
    curl_close($ch);
    return $response;
  }
  
  protected function get_xml($url, $useragent = false) {
    return simplexml_load_string($this->get_url($url, $useragent));
  }


}

?>