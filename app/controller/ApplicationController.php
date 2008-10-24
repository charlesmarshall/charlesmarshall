<?php

class ApplicationController extends CMSApplicationController{
	
	public $style = false; //either day or night
	
	
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
	public function get_url(){
		if($this->cms_content->id) return $this->cms_content->permalink();
		elseif($this->cms_section->id) return $this->cms_section->permalink();
		elseif($this->controller != "page") return "/".$controller."/".$action;
		else return $action;
	}
	
}

?>