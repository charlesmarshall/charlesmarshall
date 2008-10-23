<?php

class ApplicationController extends CMSApplicationController{
	
	public $style = false; //either day or night
	
	
	public function get_body_id(){
		if($this->cms_section->id) return str_replace("/","",$this->cms_section->permalink);
		elseif($this->current_category->id) return str_replace("/","",$this->current_category->url);
		else return $this->action;
	}
	public function get_body_class(){
		return "hour_".date("H");
	}
	public function get_stylesheet(){
		return "day";
		$hour = date("H");
		if($hour > 7 && $hour < 19) return "day";
		else return "night";
	}
	
}

?>