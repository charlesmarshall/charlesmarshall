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

}

?>