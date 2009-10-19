jQuery(document).ready(function(){
  page_init();
  //if(jQuery('body').hasClass('post_page') || jQuery('#disqus_thread').length) comment_count();
});
function page_init(){
  cat_list_accordion();
}

function cat_list_accordion(){
  jQuery('#category_list').accordion();
}


function comment_count() {
	var links = document.getElementsByTagName('a');
	var query = '?';
	for(var i = 0; i < links.length; i++) {
	  if(links[i].href.indexOf('#disqus_thread') >= 0)  query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
	}
	document.write('<script charset="utf-8" type="text/javascript" src="http://disqus.com/forums/charlesmarshall/get_num_replies.js' + query + '"></' + 'script>');
}

