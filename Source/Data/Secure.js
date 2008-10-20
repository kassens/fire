var Secure = new Class({

	initialize: function(key){
		this.key = key;
	},

	write: function(value){
		var bytes = new air.ByteArray();
		bytes.writeUTFBytes(value);
		air.EncryptedLocalStore.setItem(this.key, bytes);
		return this;
	},

	// TODO: should return null, if key not found
	read: function(){
		var storedValue = air.EncryptedLocalStore.getItem(this.key);
		return storedValue.readUTFBytes(storedValue.length);
	},

	dispose: function(){
		air.EncryptedLocalStore.removeItem(this.key);
	}

});

Secure.write = function(key, value){
	return new Secure(key).write(value);
};

Secure.read = function(key){
	return new Secure(key).read();
};

Secure.dispose = function(key, options){
	return new Secure(key).dispose();
};
