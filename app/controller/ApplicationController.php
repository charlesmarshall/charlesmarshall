<?php

class ApplicationController extends CMSApplicationController{
	
	public $flickr_per_page = 4;
	public $flickr_page = 1;
	public $flickr_size = "m";
	public $flickr_fmod = 2;
	public $flickr_show_title = true;
	public $flickr_user = "81461873@N00";
	public $flickr_secret_key = "c376479878c604c3a4a0b9af31930313";
	
	
	public function get_body_id(){
		if($this->cms_section->id) return str_replace("/","",$this->cms_section->permalink);
		elseif($this->current_category->id) return str_replace("/","",$this->current_category->url);
		else return $this->action;
	}
	public function get_body_class(){
		if($this->cms_content->id) return "page";
		elseif($this->cms_section->id) return "list";
		else return "view";
	}

	
}

?>