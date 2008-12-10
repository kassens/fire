var FilesystemObject = new Class({

	options: {
		create: true,
		createParents: true // bad naming
	},

	initialize: function(path, options){
		this.file = File.resolve(path);
	},

	move: function(dir){
		// moves to dir
		// dir is a string or Directory
	},

	trash: function(){
		this.file.moveToTrash();
	},

	getPath: function(){
		return this.file.nativePath;
	}

});

FilesystemObject.create = function(file){
	if (file.isDirectory) return new Directory(file);
	return new File(file);
};

var Directory = new Class({

	Extends: FilesystemObject,

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
		return this.file.getDirectoryListing().map(FilesystemObject.create);
	}

});

var File = new Class({

	Extends: FilesystemObject,

	initialize: function(path, options){
		this.parent(path, options);
	},

	dispose: function(){
		this.file.deleteFile();
		return this;
	},

	// overrides the file
	write: function(str){
	},

	// appends str to the end of the file
	append: function(str){
	},

	// returns the content
	read: function(){
		var stream = new air.FileStream();
		stream.open(this.file, 'read');
		var str = stream.readUTFBytes(stream.bytesAvailable);
		stream.close();
		return str;
	}

});

File.protocols = {
	desktop: air.File.desktopDirectory,
	documents: air.File.documentsDirectory,
	user: air.File.userDirectory
};

File.resolve = function(path){
	if (path.nativePath) return path; // better check?
	return $try(function(){
		return new air.File(path);
	}, function(){
		var match = path.match(/^([a-z\-]+):\/(.*)$/);
		return File.protocols[match[1]].resolvePath(match[2]);
	});
};