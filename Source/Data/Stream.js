var Stream = new Class({

	Implements: [Events],

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

	initialize: function(stream){
		this.stream = stream;

		if (!Stream.extend(this)) return false;
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
			air.trace(e);
		}
		return response;
	},

	onError: function(){
		this.fireEvent("error", arguments);
	}

});

// This is needed because stupid adobe air
// doesn't want us iterating through its objects.
Stream.$props = $H({
	"bytesAvailable": [],
	"connected": [1, 3],
	"endian": [],
	"objectEncoding": [],
	"position": [2],
	"readAhead": [2],
	"timeout": [1],
	"close": [],
	"load": [3],
	"open": [2],
	"openAsync": [2],
	"connect": [1],
	"flush": [1],
	"truncate": [2]
});

Stream.$events = $H({
	"close": [],
	"complete": [2, 3],
	"connect": [1],
	"httpResponseStatus": [3],
	"httpStatus": [3],
	"ioError": [],
	"open": [3],
	"outputProgress": [2],
	"progress": [2],
	"securityError": [1, 3],
	"socketData": [1]
});

Stream.extend = function(obj){
	var objType = 0;
	if (obj.stream.constructor == air.Socket) objType = 1;
	else if (obj.stream.constructor == air.FileStream) objType = 2;
	else if (obj.stream.constructor == air.FileStream) objType = 3;
	else return false;

	Stream.$props.each(function(types, prop){
		if (types.length == 0 || types.contains(objType)) {
			obj.__defineGetter__(prop, function(){
				return obj.stream[prop];
			});
			obj.__defineSetter__(prop, function(value) {
				obj.stream[prop] = value;
			});
		}
	});

	Stream.$events.each(function(types, eve){
		if ((types.length == 0 || types.contains(objType))) {
			obj.stream.addEventListener(eve, function(){
				obj.fireEvent(eve, arguments);
			});
		}
	});

	return true;
};