<?php

class PageController extends ApplicationController {
	
	public function controller_global(){
		parent::cms();
		$this->body_id = parent::get_body_id();
		$this->body_class = parent::get_body_class();	
		$this->style = parent::get_stylesheet();	
	}
  
  public function index() {
    
  }
  
}

?>