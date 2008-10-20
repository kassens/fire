var Secure = new Class({

	Implements: Options,

	options: {
		stronglyBound: false
	},

	initialize: function(key, options){
		this.setOptions(options);
		this.key = key;
	},

	read: function(){
		return Secure.read(this.key);
	},

	write: function(value){
		Secure.write(this.key, value, this.options.stronglyBound);
		return this;
	},

	dispose: function(){
		Secure.dispose(this.key);
		return this;
	}

});

Secure.read = function(key){
	var bytes = air.EncryptedLocalStore.getItem(key);
	return (bytes === null) ? null : bytes.readUTFBytes(bytes.length);
};

Secure.write = function(key, value, stronglyBound){
	var bytes = new air.ByteArray();
	bytes.writeUTFBytes(value);
	air.EncryptedLocalStore.setItem(key, bytes, stronglyBound);
};

Secure.dispose = function(key){
	air.EncryptedLocalStore.removeItem(key);
};

// Clears the entire encrypted local store, deleting all data.
Secure.reset = function(){
	air.EncryptedLocalStore.reset();
};
