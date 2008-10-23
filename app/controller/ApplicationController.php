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
		$hour = date("H");
		if($hour > 6 && $hour < 20) return "day";
		else return "night";
	}
	
}

?>