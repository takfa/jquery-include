/*
	Compressed from: jquery.include.js v2.5 <http://code.google.com/p/jquery-include/>
	On: 05/03/2011 19:15
	Licence CC-BSD <http://creativecommons.org/licenses/BSD/>
*/

(function(f){var j=20,b="span",a=b+"[src],"+b+"[data-src]",h=30,c=false,i=true;function e(k){if(j--<1){return this}if(f(a).length===0){f(b+".include-loaded")[c?"show":"unwrap"]();f(document).trigger("includeReady");return this}f(a,k).each(function(){var n=f(this),o=n.attr("src")||n.attr("data-src"),m;if(o){m=o.split("/").slice(0,-1).join("/")+"/";try{f.ajax({type:"GET",url:o,complete:function(r,p){if(p==="error"||!r.responseText){d(n)}else{var q=r.responseText;if(i){q=g(q,m)}n.html(q).addClass("include-loaded").removeAttrs(["src","data-src"]);setTimeout(function(){e(n.get(0))},h)}}})}catch(l){d(n,o)}}});return this}function g(k,l){return k.replace(/(\b(?:src|href)=")([^"]+")/g,function(){var m=arguments;if(/^http(s{0,1}):\/{2}|^\//.test(m[2])){return m[1]+m[2]}return m[1]+l+m[2]})}function d(k,l){if(window.console&&console.warn){console.warn("Unable to load ",l)}setTimeout(function(){k.removeAttrs(["src","data-src"]);e(k.get(0))},h)}f.fn.includeReady=function(k){f(document).bind("includeReady",function(l){k(l)});return this};if(!f.isFunction(f.fn.unwrap)){f.fn.unwrap=function(){return this.each(function(){var k=f(this);k.replaceWith(k.contents())})}}f.fn.removeAttrs=function(l){for(var k=l.length;k--;){this.removeAttr(l[k])}};f(document).ready(function(){e(document)})})(jQuery);

