var Socket = new Class({

	Extends: Stream,

	options: {
		host: "127.0.0.1",
		port: 80,
		persistent: false,
		autoConnect: false
	},

	initialize: function(options){
		this.parent(new air.Socket(), options);
		this.response = "";
		this.addEvent('close', this.persist.bind(this), true);
		if (this.options.autoConnect) this.connect();
	},

	connected: function(){
		return this.stream.connected;
	},

	connect: function(host, port){
		this.options.host = host || this.options.host;
		this.options.port = port || this.options.port;

		this.stream.connect(this.options.host, this.options.port);
		this.fireEvent('connect');
	},

	persist: function(){
		if (this.options.persistent && !this.stream.connected) this.connect();
	},

	write: function(data, type){
		this.persist();
		this.parent(data, type);
	},

	flush: function(){
		this.persist();
		this.stream.flush();
		this.response = "";
	},

	send: function(data, type){
		this.write(data, type);
		this.flush();
	},

	read: function(type, args){
		this.persist();
		return this.parent(type, args);
	}

});
