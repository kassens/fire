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
		this.stream = stream;
		stream.endian = this.options.endian;

		var events = ['close', 'complete', 'connect', 'httpResponseStatus', 'httpStatus','ioError', 'open', 'outputProgress', 'progress', 'securityError', 'socketData'];
		events.each(function(event){
			stream.addEventListener(event, (function(){
				this.fireEvent(event, arguments);
			}).bind(this), false);
		}, this);
	},

	read: function(type, args){
		var response = "";
		type = (type) ? type.toLowerCase() : "utfbytes";
		args = args || this.stream.bytesAvailable;
		try {
			response = this.stream["read" + this.accessors[type]](args);
		} catch(e){
			this.fireEvent('error', e);
		}
		return response;
	},

	write: function(data, type){
		type = (type) ? type.toLowerCase() : "utfbytes";
		try {
			this.stream["write" + this.accessors[type]](data);
		} catch(e){
			this.fireEvent('error', e);
		}
		return this;
	},

	close: function(){
		this.stream.close();
		return this;
	}

});
