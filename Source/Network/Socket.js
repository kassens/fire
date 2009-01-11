var Socket = new Class({

	Extends: Stream,

	options: {
		host: "127.0.0.1",
		port: 80,
		persistent: false,
		autoConnect: false
	},

	accessors: {
		"boolean": "Boolean",
		"byte": "Byte",
		"bytes": "Bytes",
		"double": "Double",
		"float": "Float",
		"int": "Int",
		"multibyte": "MultiByte",
		"object": "Object",
		"short": "Short",
		"unsignedbyte": "UnsignedByte",
		"unsignedint": "UnsignedInt",
		"unsignedshort": "UnsignedShort",
		"utf": "UTF",
		"utfbytes": "UTFBytes"
	},

	initialize: function(options){
		this.parent(new air.Socket(), options);
		this.response = "";
		if (this.options.autoConnect) this.connect();
	},

	connected: function(){
		return this.stream.connected;
	},

	connect: function(host, port){
		this.options.host = host || this.options.host;
		this.options.port = port || this.options.port;

		this.stream.connect(this.options.host, this.options.port);
		this.onConnect(this);
	},

	persist: function(){
		if (this.options.persistent && !this.stream.connected) this.connect();
	},

	write: function(data, type){
		this.persist();
		this.parent();
	},

	flush: function(){
		this.persist();
		this.stream.flush();
		this.response = "";
	},

	send: function(data, type){
		this.write(data, type);
		this.flush();
	},

	read: function(type, args){
		this.persist();
		return this.parent();
	},

	close: function(){
		this.stream.close();
	}

});
