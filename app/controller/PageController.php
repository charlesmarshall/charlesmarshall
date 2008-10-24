<?php

class PageController extends ApplicationController {

	public $this_page = 1;
	public $per_page = 4;
	
	public function controller_global(){
		parent::cms();
		$this->body_id = parent::get_body_id();
		$this->body_class = parent::get_body_class();	
	}
  
  public function index() {
    $model = new CmsContent("published");
		$this->cms_content[0] = $model->filter(array('cms_section_id'=>3))->order('published DESC')->first();
  }
  
}

?>