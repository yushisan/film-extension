(function() {
	var storagehelper=location.href.indexOf("http://v.qq.com/storage_helper.html")==-1;
	if(window.location.host=="film.qq.com"||(window.location.host=="v.qq.com"&&storagehelper)){
		document.body.setAttribute('film-extension-installed', '0.1.5');
		var cookies = document.cookie;
		safari.self.tab.dispatchMessage("cookies",cookies);
	}
})();