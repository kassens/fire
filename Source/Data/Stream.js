var Stream = new Class({

	Implements: [Events, Options],

	options: {
		endian: "bigEndian"
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

	initialize: function(stream, options){
		this.setOptions(options);
		stream.endian = this.options.endian;
		stream.addEventListener("close", this.onClose.bind(this));
		stream.addEventListener("connect", this.onConnected.bind(this));
		stream.addEventListener("ioError", this.onError.bind(this));
		stream.addEventListener("securityError", this.onError.bind(this));
		stream.addEventListener("socketData", this.onData.bind(this));
		this.stream = stream;
	},

	write: function(data, type){
		type = (type) ? type.toLowerCase() : "utfbytes";
		var writer = this.stream["write" + this.accessors[type]];
		if (type == "utfbytes") data += "\n";
		try {
			writer(data);
		} catch(e){
			this.onError(e);
		}
	},

	read: function(type, args){
		var response = "";
		type = (type) ? type.toLowerCase() : "utfbytes";
		args = args || this.stream.bytesAvailable;
		try {
			response = this.stream["read" + this.accessors[type]](args);
		} catch(e){
			this.onError(e);
		}
		return response;
	},

	onError: function(){
		this.fireEvent("error", arguments);
	},

	onConnect: function(){
		this.fireEvent("connect", arguments);
	},

	onConnected: function(){
		this.fireEvent("connected", arguments);
	},

	onData: function(){
		this.fireEvent("data", arguments);
	},

	onClose: function(){
		this.fireEvent("close", arguments);
		this.persist();
	}

});
