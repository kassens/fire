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
		
		Stream.extend(this);
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
	},
	
	extend: function(){
		

	}
});

// This is needed because stupid adobe air
// doesn't want us iterating through its objects.
Stream.$props = $H({
	"bytesAvailable": [],
	"connected": [1, 2],
	"endian": [],
	"objectEncoding": [],
	"timeout": [1],
	"close": [1],
	"connect": [1],
	"flush": [1]
});

Stream.$events = $H({
	"close": [],
	"connect": [],
	"ioError": [],
	"securityError": [],
	"socketData": []
});

Stream.extend = function(obj){
	var objType = 0;
	if (obj.stream.constructor == air.Socket) objType = 1;
	else if (obj.stream.constructor == air.FileStream) objType = 2;
	
	Stream.$props.each(function(types, prop){
		if (types.length == 0 || types.contains(objType)) {
			obj.__defineGetter__(prop, function() {
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
};