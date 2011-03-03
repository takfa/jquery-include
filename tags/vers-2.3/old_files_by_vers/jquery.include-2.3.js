/*
	jquery.include-2.3 <http://code.google.com/p/jquery-include/>
	@version  2.3
 	@author   John Hunter on 2011-02-03
	Licence CC-BSD <http://creativecommons.org/licenses/BSD/>
	
	Uses a standard tag with an src value <span src=""></span> - these are stripped from the dom after loading.
	Can handle nested includes - linking paths in the include file are modifed to match the host page context.
	For post-include scripts $(document).includeReady works the same as $(document).ready
	
	Based on ideas from hinclude by Mark Nottingham <mnot@pobox.com>
	
	Note: Firefox 3+ throws a NS_ERROR_DOM_BAD_URI exception when an xhr file: request is made above the current file context
	https://developer.mozilla.org/En/HTTP_access_control
	(e.g. src="../foo").
	You can override this behavour by setting the browser config:
	about:config ->
		security.fileuri.strict_origin_policy = false
	
	
	version 2.3
	- move from success/error callbacks to use complete due to failure with jQuery 1.5
	
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
						// CHANGED: to complete event, jQuery 1.5 triggers error callback despite having a responseText.
						complete: function (xhr, status) {
							if (status === 'error' || !xhr.responseText) {
								handleError(inc);
							}
							else {
								var data = xhr.responseText;
								if (rewritePaths) {
									data = pathRewrite(data, path);
								}
								inc.html(data).removeAttr('src').addClass('include-loaded');//.hide();
								setTimeout(function () { parse(inc.get(0)); }, ieParseDelay);
							}
						}
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
