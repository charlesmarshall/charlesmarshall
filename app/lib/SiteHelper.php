<?
class SiteHelper extends WXHelpers {
  	
	public function short_date($date){
		return date("dS M", strtotime($date));
	}
	public function long_date($date){
		return date("nS F Y", strtotime($date));
	}	
	

} // END class 

