This jQuery plugin provides browser based file include similar to SSI. The main use is for html prototyping where the files are going to be viewed in a file system rather than hosted. If you are looking for a production solution then this isn't it - a better option would be some flavour of server-side includes.

The plugin can handle nested includes - linking paths in the include file are modified to match the host page context. For post-include processing the `includeReady` method is similar the `jQuery.ready` method.

You can [download the distribution zip](http://code.google.com/p/jquery-include/downloads/list) which contains the plugin and use examples, view the [versions](http://code.google.com/p/jquery-include/source/browse/#svn/tags), or the [current source](http://code.google.com/p/jquery-include/source/browse/#svn/trunk). If you find the plugin useful please let me know at [johnhunter.info](http://johnhunter.info).

**Current version:** 2.5 (compatible with jQuery 1.5 and HTML5)

**Include initialisation:**
```
$(document).includeReady(function () {

	// initialisation code here
	// e.g. modify include dom

});
```

**Include tag useage:**
```

<span src="includes/test1.html">

	<p class="error-msg">include has not loaded</p>

</span>

```

**HTML5 Include tag useage:**

You can use this alternative attribute which will validate to html5 if you use the [html5 doctype](http://ejohn.org/blog/html5-doctype/). ([see issue#1](http://code.google.com/p/jquery-include/issues/detail?id=1))
```
<span data-src="includes/test1.html">

	<p class="error-msg">include has not loaded</p>

</span>

```

**Firefox Note:** When used in a file system Firefox will not load includes above the current page file context. E.G. `<span src="../includes/nav.html">` will not work when you load from a `file:` url. You can modify this behaviour by changing the browser default security settings:

> Enter `about:config` in the address bar, then change the value from `true` to `false` for `security.fileuri.strict_origin_policy` which will grant access to all of the files using scheme file:
> courtesy [C.W. Holeman II](http://stackoverflow.com/questions/3181911/why-does-jquery-get-home-user-0-0a-html-fail-when-using-file-rather-than-htt/3188707#3188707)

**Chrome Note:** When used in a file system Chrome will not load includes by default due to [Access-Control restrictions](http://code.google.com/p/chromium/issues/detail?id=47416) in the local file system. To run Chrome without these restrictions start the application from the command line with the `--allow-file-access-from-files` flag, e.g.
```
chrome.exe --allow-file-access-from-files
```