<?php
class AdminProductsController extends CMSAdminContentController {
  public $module_name = "products";											
	public $model_class = 'Product';
	public $model_name = "product";													
	public $display_name = "Products";
	

	public $scaffold_columns = array(
    "title"   =>array(),
		"found_in" => array(),
		"item_status" => array()
  );
  public $filter_columns = array("title");
  
	
	public function create(){
		$model = new Product();
		$model->url = "url-".time();
		$model->title ="";
		$model->status = 3;
		$this->redirect_to("/admin/products/edit/".$model->save()->id."/");
	}

	
	
	
	
}
?>