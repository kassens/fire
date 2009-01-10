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

		this.socket = new air.Socket();
		this.socket.endian = this.options.endian;
		this.socket.addEventListener("close", this.onClose.bind(this));
		this.socket.addEventListener("connect", this.onConnected.bind(this));
		this.socket.addEventListener("ioError", this.onError.bind(this));
		this.socket.addEventListener("securityError", this.onError.bind(this));
		this.socket.addEventListener("socketData", this.onData.bind(this));

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
		type = (type) ? type.toLowerCase() : "utfbytes";
		var writer = this.socket["write" + this.accessors[type]];
		if (type == "utfbytes") data += "\n";
		try {
			writer(data);
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
		type = (type) ? String.toLowerCase(type) : "utfbytes";
		args = args || this.socket.bytesAvailable;
		try {
			this.response = this.socket["read" + this.accessors[type]](args);
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