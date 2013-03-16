<?
/**
 * Base level scan class
 */
class Scanner{

  public $url = false;
  public $content = false;

  public function __construct($options = array() ){
    foreach($options as $k=>$v) $this->$k = $v;
  }

  public function fetch(){
    if($raw_content = $this->curl_request($this->url)) $this->content = $raw_content;
    return $this;
  }

  private function curl_request($url, $post_data=false, $username=false, $password=false){
    $headers = array("Content-Type: application/html; charset=UTF-8",
                     "Accept: application/html; charset=UTF-8"
                    );
    $session = curl_init($url);

    if($post_data){
      curl_setopt($session, CURLOPT_POST, 1);
      curl_setopt($session, CURLOPT_POSTFIELDS, $post_data);
    }
    if($username && $password) curl_setopt($session, CURLOPT_USERPWD, $username.':'.$password);

    curl_setopt($session, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($session, CURLOPT_FOLLOWLOCATION, 1);
    $exec =  curl_exec($session);
    $info = curl_getInfo($session);
    if($info['http_code'] == 200) return $exec;
    return false;
  }






}
?>