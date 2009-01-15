var Socket = new Class({

	Extends: Stream,

	options: {
		host: "127.0.0.1",
		port: 80,
		timeout: 20000,
		persistent: false,
		autoConnect: false
	},

	initialize: function(options){
		this.parent(new air.Socket(), options);
		if ($defined(this.stream.timeout)) this.stream.timeout = this.options.timeout;
		this.addEvent('close', this.persist.bind(this), true);
		if (this.options.autoConnect) this.connect();
	},

	isConnected: function(){
		return this.stream.connected;
	},

	connect: function(host, port){
		this.host = host || this.options.host;
		this.port = port || this.options.port;
		this.stream.connect(this.host, this.port);
		return this;
	},

	persist: function(){
		if (this.options.persistent && !this.stream.connected) this.connect(this.host, this.port);
	},

	read: function(type, args){
		this.persist();
		return this.parent(type, args);
	},

	write: function(data, type){
		this.persist();
		return this.parent(data, type);
	},

	send: function(data, type){
		this.write(data, type);
		return this.flush();
	},

	flush: function(){
		this.persist();
		this.stream.flush();
		return this;
	},

	close: function(){
		if (this.stream.connected) this.parent();
	}

});
