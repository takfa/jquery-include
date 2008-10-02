/*
	jquery.include-2
	@version  2.1
 	@author   John Hunter on 2008-09-20.
	Licence CC-BSD <http://creativecommons.org/licenses/BSD/>
	
	Uses a standard tag with an src value <span src=""></span> - these are stripped from the dom after loading.
	Can handle nested includes - linking paths in the include file are modifed to match the host page context.
	For post-include scripts $(document).includeReady works the same as $(document).ready
	
	Based on ideas from hinclude by Mark Nottingham <mnot@pobox.com>
*/



(function($) {
	var maxRegression = 20;
	var tagName = 'span';
	var keepIncludeTags = false;
	
	
	var parse = function (domNode) {
		if (maxRegression-- < 1) return this;
		
		// remove include tags and fire ready event
		if ($(tagName +'[src]').length === 0) {
			if (!keepIncludeTags) $(tagName +'.include-loaded').unwrap();
			else $(tagName +'.include-loaded').show();
			
			$(document).trigger('includeReady');
			return this;
		}
		
		// load and parse include
		$(tagName +'[src]', domNode).each(function () {
			var inc = $(this);
			var src = inc.attr('src');
			if (src) {
				var path = src.split('/').slice(0, -1).join('/') + '/';
				$.get(src, function(data) {
					
					// modify any relative paths 
					data = data.replace(/(\b(?:src|href)=")([^"]+")/g, function () {
						var s = arguments;
						if (/^http(s{0,1}):\/{2}|^\//.test(s[2])) {
							return s[1] + s[2];
						}
						return s[1] + path + s[2];
					});
					
					inc.html(data).addClass('include-loaded').removeAttr('src').hide();
					
					setTimeout(function () { parse(inc.get(0)); }, 30);// delay for IE
				});	
			}
		});
		return this;
	};
	
	
	// create the custom event
	$.fn.includeReady = function (observerFn) {
		$(document).bind('includeReady', function(event) {
			observerFn(event);
		});
		return this;
	};
	
	$.fn.unwrap = function () {
		$(this).each(function () {
			var el = $(this);
			el.replaceWith(el.contents());
		});
		return this;
	};
	
	$(document).ready(function() {
		parse(document);
	});
		
})(jQuery);
