<?php

class PageController extends ApplicationController {

	public $this_page = 1;
	public $per_page = 4;
	
	public function controller_global(){
		parent::cms();
		$this->body_id = parent::get_body_id();
		$this->body_class = parent::get_body_class();	
		$this->style = parent::get_stylesheet();	
	}
  
  public function index() {
    $model = new CmsContent("published");
		if(Request::get('page')) $this->this_page = Request::get('page');
		$this->cms_content = $model->order('published DESC')->page($this->this_page, $this->per_page);
  }
  
}

?>