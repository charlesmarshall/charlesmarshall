<?
class SiteHelper extends WXHelpers {
  	
	public function page_title($page, $section, $name, $seperator = " - ", $field="title"){
		return $this->make_title($page, $seperator, $field) . $this->make_title($section, $seperator, $field) . $name;
	}	
	protected function make_title($info, $seperator = " - ", $field=""){
		if($info->parent_id > 1) return CmsTextFilter::filter("before_output",html_entity_decode($info->$field) ) . $seperator . $this->make_title(new CmsSection($info->parent_id), $seperator ) ;
		elseif($info->$field) return CmsTextFilter::filter("before_output", html_entity_decode($info->$field) ) . $seperator;
		elseif(is_string($info)) return CmsTextFilter::filter("before_output",html_entity_decode($info)) . $seperator;
		else return "";
	}
	
	public function short_date($date){
		return date("dS M", strtotime($date));
	}
	public function long_date($date){
		return date("nS F Y", strtotime($date));
	}	
	
	
	public function keywords($object, $field="title", $words=8){
		if($string = $object->$field) return $this->word_truncation($string, $words, true);
		else return "";
	}
	public function description($object, $field="title", $words=10){
		if($string = $object->$field) return $this->word_truncation($string, $words, true, " ");
		else return "";
	}

	public function word_truncation($content, $word_limit=30, $striptags=false, $seperator=",",$offset=0) {		
		if($striptags) $content = strip_tags($content);
    $parts = preg_split("/[\s]+/i", $content, -1, PREG_SPLIT_NO_EMPTY|PREG_SPLIT_OFFSET_CAPTURE|PREG_SPLIT_DELIM_CAPTURE);
		$chunk = array_slice($parts, $offset, $word_limit);
		$words = array();
		$tags = array();
		foreach($chunk as $segmant) $words[] = $segmant[0];
		$string = implode($seperator,$words);
		//if html is being kept, append closing tags - WILL ONLY WORK IN VALID HTML!
		if(!$striptags){
			//find all tags
			$pattern = "/<([\/]*)([\w]+)>/i";
			preg_match_all($pattern, $string, $tags, PREG_SET_ORDER);
			$missing = array();
			foreach($tags as $tag){
				$index = $tag[2];
				//this is an end tag
				if(strlen($tag[0])>0 && strlen($tag[1]) >0) unset($missing[$index]);
				else $missing[$index] = true;
			}
			if(count($missing)){
				$missing = array_reverse($missing);
				$i=0;
				foreach($missing as $needed){
					if($i+1 == count($missing) && count($parts)>$word_limit) $string .= "...";
					$string .= "</".$needed.">";
					$i++;
				}
			}
		}elseif(count($chunk)>$word_limit) $string .= "...";

		return $string;
  }

	public function nav($url, $display, $current, $selected_id, $options=array()) {
    if(is_array($url)) {
      if(is_array($current) && $url["action"]==$current["action"] && $url["controller"]=$current["controller"]) {
        $li_options["id"]=$selected_id;
				$options['href']=url_for($url);
        return content_tag("li", content_tag("a", $display, $options), $li_options );
      }
      elseif($url["action"] == $current) {
        $li_options["id"]=$selected_id;
				$options['href']=url_for($url);
        return content_tag("li", content_tag("a", $display, $options), $li_options );
      }
      $url = url_for($url);
    }
		$options['href']= $url;
    if(substr($url, 1) == $current) return content_tag("li", content_tag("a", $display, $options), array("id"=>$selected_id));
    return content_tag("li", content_tag("a", $display, $options));
  }

} // END class 

