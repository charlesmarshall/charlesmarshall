<?php
/**
* CMS Controller extends CMSController
* @package wxFramework
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class AdminHomeController extends CMSAdminHomeController{
	public function index() {
	  $this->stat_search = unserialize(file_get_contents("http://stats.oneblackbear.com/index.php?module=API&method=Referers.getKeywords&idSite=5&period=week&date=yesterday&format=PHP&token_auth=ae290d98aa13255678682381827a6862"));
	  $this->stat_links = unserialize(file_get_contents("http://stats.oneblackbear.com/index.php?module=API&method=Referers.getWebsites&idSite=5&period=week&date=yesterday&format=PHP&token_auth=ae290d98aa13255678682381827a6862"));
	  $this->stat_dash = ($li = CmsConfiguration::get("stat_dash_url")) ? $this->parse_xml($li, 5, "visit_day") : array();
	  $this->link_module = $this->render_partial("stat_links");
	  $this->search_module = $this->render_partial("stat_search");
	  $this->dash_module = $this->render_partial("stat_dash");
 	}
}
?>