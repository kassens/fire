var Socket = new Class({

	Implements: [Events, Options],

	options: {
		host: "127.0.0.1",
		port: 80,
		persistent: false,
		endian: "bigEndian",
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
		this.setOptions(options);

		this.socket = new Stream(new air.Socket());
		this.socket.endian = this.options.endian;
		this.socket.addEvent("close", this.onClose.bind(this));
		this.socket.addEvent("connect", this.onConnected.bind(this));
		this.socket.addEvent("ioError", this.onError.bind(this));
		this.socket.addEvent("securityError", this.onError.bind(this));
		this.socket.addEvent("socketData", this.onData.bind(this));

		this.response = "";

		if (this.options.autoConnect) this.connect();
	},

	connected: function(){
		return this.socket.connected;
	},

	connect: function(host, port){
		this.options.host = host || this.options.host;
		this.options.port = port || this.options.port;

		this.socket.connect(this.options.host, this.options.port);
		this.onConnect(this);
	},

	persist: function(){
		if (this.options.persistent && !this.socket.connected) this.connect();
	},

	write: function(data, type){
		this.persist();
		try {
			this.socket.write(data, type);
		} catch(e){
			this.onError(e);
		}
	},

	flush: function(){
		this.persist();
		this.socket.flush();
		this.response = "";
	},

	send: function(data, type){
		this.write(data, type);
		this.flush();
	},

	read: function(type, args){
		this.persist();
		try {
			this.response = this.socket.read(type, args);
		} catch(e){
			this.onError(e);
		}
		return this.response;
	},

	close: function(){
		this.socket.close();
	},

	onConnect: function(){
		this.fireEvent("connect", arguments);
	},

	onConnected: function(){
		this.fireEvent("connected", arguments);
	},

	onError: function(){
		this.fireEvent("error", arguments);
	},

	onData: function(){
		this.fireEvent("data", arguments);
	},

	onClose: function(){
		this.fireEvent("close", arguments);
		this.persist();
	}
});