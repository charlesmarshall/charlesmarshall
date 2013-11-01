var config = [
  //simple loading of script
  {
    url:"http://www.google-analytics.com/ga.js",
    beforeLoad: function(){
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-927511-5']);
      _gaq.push(['_setDomainName', 'charlesmarshall.co.uk']);
      _gaq.push(['_trackPageview']);
    }
  }
];

var analytics = new loader(config);