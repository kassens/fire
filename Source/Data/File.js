var File = new Class({
	
});

File.protocols = {
	desktop: air.File.desktopDirectory,
	documents: air.File.documentsDirectory,
	user: air.File.userDirectory
};

File.resolve = function(path){
	return $try(function(){
		return new air.File(path);
	}, function(){
		var match = path.match(/^([a-z\-]+):\/(.*)$/);
		return File.protocols[match[1]].resolvePath(match[2]);
	});
};