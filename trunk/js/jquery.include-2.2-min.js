/*
	Compressed from: jquery.include.js
	On: 07/09/2010 16:27
	Licence CC-BSD <http://code.google.com/p/jquery-include/>
*/

(function(e){var i=20,a="span",g=30,b=false,h=true;function d(j){if(i--<1){return this}if(e(a+"[src]").length===0){if(!b){e(a+".include-loaded").unwrap()}else{e(a+".include-loaded").show()}e(document).trigger("includeReady");return this}e(a+"[src]",j).each(function(){var m=e(this),n=m.attr("src"),l;if(n){l=n.split("/").slice(0,-1).join("/")+"/";try{e.ajax({type:"GET",url:n,success:function(o){if(h){o=f(o,l)}m.html(o).removeAttr("src").addClass("include-loaded");setTimeout(function(){d(m.get(0))},g)},error:function(){c(m)}})}catch(k){c(m)}}});return this}function f(j,k){return j.replace(/(\b(?:src|href)=")([^"]+")/g,function(){var l=arguments;if(/^http(s{0,1}):\/{2}|^\//.test(l[2])){return l[1]+l[2]}return l[1]+k+l[2]})}function c(j){if(window.console&&console.warn){console.warn("Unable to load ",j.attr("src"))}setTimeout(function(){j.removeAttr("src");d(j.get(0))},g)}e.fn.includeReady=function(j){e(document).bind("includeReady",function(k){j(k)});return this};e.fn.unwrap=function(){return this.each(function(){var j=e(this);j.replaceWith(j.contents())})};e(document).ready(function(){d(document)})})(jQuery);

