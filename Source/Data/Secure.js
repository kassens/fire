var Secure = new Class({

	initialize: function(key){
		this.key = key;
	},

	write: function(value){
		Secure.write(this.key, value);
		return this;
	},

	read: function(){
		return Secure.read(this.key);
	},

	dispose: function(){
		Secure.dispose(this.key);
		return this;
	}

});

Secure.write = function(key, value){
	var bytes = new air.ByteArray();
	bytes.writeUTFBytes(value);
	air.EncryptedLocalStore.setItem(this.key, bytes);
};

// TODO: should return null, if key not found
Secure.read = function(key){
	var storedValue = air.EncryptedLocalStore.getItem(this.key);
	return storedValue.readUTFBytes(storedValue.length);
};

Secure.dispose = function(key){
	air.EncryptedLocalStore.removeItem(this.key);
};
