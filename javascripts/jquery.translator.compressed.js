jQuery.g.c=function(){return String(this.r(0).tagName).toLowerCase()};
(function(b){b.g.a=function(a){c[g]=b.extend({},b.g.a.m,a,{i:this});return this.n(function(){if(!this.k){this.k=g;b.a.p(g);g++}})};b.g.a.m={origin:"#translate",origin_language:"#original_language",result:"#result",result_language:"#result_language",after_translate:false};b.a={o:[],p:function(a){c[a].i.c()=="form"&&b.a.q(a);b.a.translate(a,b(c[a].origin))},q:function(a){b(c[a].origin).n(function(){var e=this;b(this).s(function(f){if((f.keyCode==13||f.keyCode==32||f.keyCode==8)&&b(this).f().length)b.a.translate(a,
e)})});b(c[a].i).submit(function(){b.a.translate(a,b(c[a].origin));return false});b(c[a].d).l(function(){b.a.translate(a,b(c[a].origin));return false});b(c[a].e).l(function(){b.a.translate(a,b(c[a].origin));return false})},translate:function(a,e){e=b(e).length?b(e):false;var f=b(c[a].d).length&&c[a].d.length>1?b(c[a].d):"",h=b(c[a].e).length&&c[a].e.length>1?b(c[a].e):"";c[a].b.length>1&&b(c[a].b).length&&b(c[a].b);var d="",j="",k="";d="";if(e){d=e.c();j=d=="input"||d=="select"||d=="textarea"?e.f():
e.text()}if(f){d=f.c();k=d=="input"||d=="select"||d=="textarea"?f.f():f.text()}else k=c[a].d;if(h){d=h.c();d=d=="input"||d=="select"||d=="textarea"?h.f():h.text()}else d=c[a].e;google.language.translate(j,k,d,function(i){if(!i.error){var l=b(c[a].b).c();l=="input"||l=="select"||l=="textarea"?b(c[a].b).f(i.j):b(c[a].b).text(i.j);c[a].h&&typeof c[a].h!="undefined"&&c[a].h(j,i.j)}})}};var c=b.a.o,g=0})(jQuery);
