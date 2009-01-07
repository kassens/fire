var AppWindow = new Class({

	Implements: Options,

	options: {
		maximizable: true,
		minimizable: true,
		resizable: true,
		systemChrome: true,
		transparent: false,
		type: 'normal', // utility, lightweight

		visible: true,
		scrollbars: true,

		bounds: {
			top: 300,
			left: 300,
			width: 300,
			height: 200
		}
	},

	initialize: function(content, options){
		this.setOptions(options);

		var windowOptions = new air.NativeWindowInitOptions();
		windowOptions.systemChrome = this.options.systemChrome ? 'standard' : 'none';
		['maximizable', 'minimizable', 'resizable', 'transparent', 'type'].each(function(option){
			windowOptions[option] = this.options[option];
		}, this);

		// TODO: should use setBounds
		var bounds = new air.Rectangle(
			this.options.bounds.top, this.options.bounds.left,
			this.options.bounds.width, this.options.bounds.height);

		var loader = air.HTMLLoader.createRootWindow(this.options.visible, windowOptions, this.options.scrollbars, bounds);
		this.nativeWindow = loader.window.nativeWindow;
		if (content.test(/[a-z]+:/)){
			var file = Filesystem.resolve(content);
			if (file) content = file.url;
			loader.load(new air.URLRequest(content));
		} else {
			loader.loadString(content);
		}
	},

	close: function(){
		this.nativeWindow.close();
		return this;
	}

});
