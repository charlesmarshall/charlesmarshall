<?php

class PageController extends ApplicationController {

	public $this_page = 1;
	public $per_page = 10;
	
	public function controller_global(){
		parent::cms();
		$this->body_id = parent::get_body_id();
		$this->body_class = parent::get_body_class();	
		if($this->use_format == "xml") $this->use_layout = false;
	}
  
  public function index() {
    $model = new CmsContent("published");
		$this->cms_content[0] = $model->filter(array('cms_section_id'=>4))->order('published DESC')->first();
  }
  

	public function category(){
		$this->use_view ="cms_list";
		if(!$this->this_page = Request::param('page')) $this->this_page = 1;
		if(!$url = Request::param('id')) $this->redirect_to('/');
		$cat = new CmsCategory;
		$this->category = $cat->filter(array('url'=>$url))->first();
		if(!$this->category->id) $this->redirect_to('/');
		$this->cms_content = $this->category->attached_to->order('published DESC')->page($this->this_page, $this->per_page);
		$this->section_stack[0] = "category";
	}

	public function sitemap(){}
	
	public function search() {
		if($query = Request::param("q")){
			$model = new CmsContent("published");
			$fields = array("title"=>'1.3', 'content'=>"0.6");				
			$search = $query;
			$this->query = $search;
			$this->cms_content = $model->search($search, $fields)->page($this->this_page, $this->per_page);
			$this->use_view = "cms_list";
		}else $this->redirect_to("/");		
		
	}
	
	

	public function related(){
		$this->use_layout = false;
		$this->use_view ="_related_list";
		$this->article_offset=0;
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
	
	
	public function related_category(){
		$this->use_layout = false;
		$this->use_view ="_related_category";
		$this->article_offset=0;
		if(Request::post('page_number') && Request::post('category') ){
			$page = parse_url(Request::post('page_number'));
			$page = str_replace("page=","",$page['query']);
			if($page && Request::post('category_id')){
				$this->this_page = $page;
				$this->category = new CmsCategory(Request::post('category_id'));
				$content = $this->category->attached_to;
				$this->cms_content = $content->order('published DESC')->page($this->this_page, $this->per_page);
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