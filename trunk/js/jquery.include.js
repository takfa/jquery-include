/*
	jquery.include-2
	@version  2.2
 	@author   John Hunter on 2008-09-20.
	Licence CC-BSD <http://creativecommons.org/licenses/BSD/>
	
	Uses a standard tag with an src value <span src=""></span> - these are stripped from the dom after loading.
	Can handle nested includes - linking paths in the include file are modifed to match the host page context.
	For post-include scripts $(document).includeReady works the same as $(document).ready
	
	Based on ideas from hinclude by Mark Nottingham <mnot@pobox.com>
	
	Note: Firefox 3+ throws a NS_ERROR_DOM_BAD_URI exception when an xhr file: request is made above the current file context
	https://developer.mozilla.org/En/HTTP_access_control
	(e.g. src="../foo").
	
*/
(function($) {
	var maxRegression = 20,
		tagName = 'span',
		ieParseDelay = 30,
		
		keepIncludeTags = false,
		rewritePaths = true;
	
	
	function parse (domNode) {
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
			var inc = $(this),
				src = inc.attr('src'),
				path;
			
			if (src) {
				path = src.split('/').slice(0, -1).join('/') + '/';
				try {
					
					$.ajax({
						type: "GET",
						url: src,
						success: function(data) {
							if (rewritePaths) {
								data = pathRewrite(data, path);
							}
							inc.html(data).removeAttr('src').addClass('include-loaded');//.hide();
							setTimeout(function () { parse(inc.get(0)); }, ieParseDelay);
						},
						error: function () { handleError(inc); }
					});

				} catch(e) { handleError(inc); }// catch and ignore NS_ERROR_DOM_BAD_URI exceptions
			}
		});
		return this;
	};
	
	
	function pathRewrite (html, path) {
		// modify any relative paths 
		return html.replace(/(\b(?:src|href)=")([^"]+")/g, function () {
			var s = arguments;
			if (/^http(s{0,1}):\/{2}|^\//.test(s[2])) {
				return s[1] + s[2];
			}
			return s[1] + path + s[2];
		});
	}
	
	function handleError (inc) {
		if (window.console && console.warn) console.warn('Unable to load ', inc.attr('src'));
		setTimeout(function () {
				inc.removeAttr('src');
				parse(inc.get(0));
			}, ieParseDelay);
	};
	
	
	// create the custom event
	$.fn.includeReady = function (observerFn) {
		$(document).bind('includeReady', function(event) {
			observerFn(event);
		});
		return this;
	};
	
	$.fn.unwrap = function () {
		return this.each(function () {
			var el = $(this);
			el.replaceWith(el.contents());
		});
	};
	
	$(document).ready(function() {
		parse(document);
	});
		
})(jQuery);
