var AppWindow = new Class({
	
	initialize: function(content){
		var loader = air.HTMLLoader.createRootWindow();
		this.nativeWindow = loader.window.nativeWindow;
		if (content.test(/[a-z]+:/)){
			var file = Filesystem.resolve(content);
			if (file) content = file.url;
			loader.load(new air.URLRequest(content));
		}
		else loader.loadString(content);
	},
	
	close: function(){
		this.nativeWindow.close();
		return this;
	}
	
});
