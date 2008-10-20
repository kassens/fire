Hash.Secure = new Class({

	Extends: Secure,
	
	options: {
		autoSave: true
	},

	initialize: function(key, options){
		this.parent(key, options);
		this.load();
	},

	save: function(){
		var value = JSON.encode(this.hash);
		if (!value) return false;
		if (value == '{}') this.dispose();
		else this.write(value);
		return true;
	},

	load: function(){
		this.hash = new Hash(JSON.decode(this.read(), true));
		return this;
	}

});

Hash.Secure.implement((function(){

	var methods = {};

	Hash.each(Hash.prototype, function(method, name){
		methods[name] = function(){
			var value = method.apply(this.hash, arguments);
			if (this.options.autoSave) this.save();
			return value;
		};
	});

	return methods;

})());
