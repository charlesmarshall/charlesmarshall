<?php


class GalleryController extends ApplicationController {
	
	public $flickr_per_page = 9;
	public $flickr_page = 1;
	public $flickr_size = "s";
	public $flickr_fmod = 3;
	public $flickr_show_title = true;
	
	
	public function controller_global(){
		$this->body_id = parent::get_body_id();
		$this->body_class = parent::get_body_class();
		$this->flickr = new Flickr($this->flickr_secret_key,true);	
	}
  
	
	public function index(){
		$this->sets = $this->flickr->get_photosets(array('user_id'=>$this->flickr_user) );
		if(!$this->flickr_page = Request::get('page')) $this->flickr_page = 1;
	}	
	
	public function set(){
		if(!$this->set_id = Request::get('id')) $this->redirect_to("/gallery");
		if(!$this->flickr_page = Request::get('page')) $this->flickr_page = 1;
		$this->info = $this->flickr->get_photoset_info(array('photoset_id'=>$this->set_id));
		$this->pics = $this->flickr->get_photoset_photos(array('photoset_id'=>$this->set_id, 'per_page'=>$this->flickr_per_page, 'page'=>$this->flickr_page) );
		$this->page_title = $this->info['title'];
	}
	
	
}

?>