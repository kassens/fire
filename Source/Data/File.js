var Filesystem = {

	protocols: {
		desktop: air.File.desktopDirectory,
		documents: air.File.documentsDirectory,
		user: air.File.userDirectory
	},

	resolve: function(path){
		if (path.nativePath) return path; // better check?
		return $try(function(){
			return new air.File(path);
		}, function(){
			var match = path.match(/^([a-z\-]+):\/(.*)$/);
			return File.protocols[match[1]].resolvePath(match[2]);
		});
	},

	create: function(file){
		if (file.isDirectory) return new Directory(file);
		return new File(file);
	}

};

Filesystem.Object = new Class({

	options: {
		create: true,
		createParents: true // bad naming
	},

	initialize: function(path, options){
		this.file = Filesystem.resolve(path);
	},

	move: function(target, override){
		this.file.moveTo(Filesystem.resolve(target), override);
		return this;
	},

	trash: function(){
		this.file.moveToTrash();
	},

	getPath: function(){
		return this.file.nativePath;
	}

});

var Directory = new Class({

	Extends: Filesystem.Object,

	initialize: function(path, options){
		this.parent(path, options);
	},

	// recursive: (default = false)
	dispose: function(recursive){
		this.file.deleteDirectory(recursive);
		return this;
	},

	// returns an array of <File>s and <Directory>s
	list: function(){
		return this.file.getDirectoryListing().map(Filesystem.create);
	}

});

var File = new Class({

	Extends: Filesystem.Object,

	initialize: function(path, options){
		this.parent(path, options);
	},

	dispose: function(){
		this.file.deleteFile();
		return this;
	},

	// overrides the file
	write: function(str, type, append){
		var stream = new Stream(new air.FileStream());
		stream.stream.open(this.file, append ? 'append' : 'write');
		stream.write(str, type);
		stream.close();
		return this;
	},

	// appends str to the end of the file
	append: function(str, type){
		return this.write(str, type, true);
	},

	// returns the content
	read: function(){
		try {
			var stream = new Stream(new air.FileStream());
			stream.stream.open(this.file, 'read');
			var str = stream.read();
			stream.close();
			return str;
		} catch (e){
			return null;
		}
	}

});

File.Temp = new Class({

	Extends: File,

	initialize: function(options){
		this.parent(air.File.createTempFile());
	}

});

Directory.Temp = new Class({

	Extends: Directory,

	initialize: function(options){
		this.parent(air.File.createTempDirectory());
	}

});
