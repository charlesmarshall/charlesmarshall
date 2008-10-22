<?php
class AdminCategoriesController extends CMSAdminCategoryController {  
  
	public $scaffold_columns = array(
    "name"   =>array(),
		"groups"=>array()
	);
	public $allowed_images = 1;

	public function edit(){
		parent::edit();
		$this->image_model = new WildfireFile;
		if(!$this->attached_images = $this->model->images) $this->attached_images=array();
		$this->image_partial = $this->render_partial("page_images");
		$this->form = $this->render_partial("form");
	}
	
	/**
	* Ajax function - associates the image whose id is posted in with the content record
	* - image id via POST
	* - content id via url (/admin/content/add_image/id)
	**/
	public function add_image() {
		$this->use_layout=false;
		$this->page = new $this->model_class(Request::get('id'));
		$file = new WildfireFile(Request::post('id'));
		$this->page->images = $file;
		$this->image = $file;
	}
	/**
	* Ajax function - removes the association between the image & content whose details are passed in 
	* - image id via POST
	* - content id via url (/admin/content/remove_image/ID)
	**/
	public function remove_image() {
		$this->use_layout=false;
		$page = new $this->model_class(Request::get('id'));
		$image = new WildfireFile($this->param("image"));
		$page->images->unlink($image);
	}
}
?>