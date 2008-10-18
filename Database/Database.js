var Database = new Class({

	Implements: [Events, Options],

	options: {
		file: 'database.sqlite'
	},

	initialize: function(options){
		this.setOptions(options);

		this.connection = new air.SQLConnection();
		this.connection.addEventListener('open', this.onOpen.bind(this));
		this.connection.addEventListener('error', this.onError.bind(this));

		var file = air.File.applicationDirectory.resolvePath(this.options.file);
		this.connection.openAsync(file);
	},

	prepare: function(text, options){
		return new Database.Query(this, text, options);
	},

	prepareInsert: function(table, options){
		return new Database.Query.Insert(this, table, options);
	},

	loadSchema: function(type, name, callback){
		this.connection.loadSchema(type, name, 'main', true, new air.Responder(callback, this.onError.bind(this)));
	},

	loadTableSchema: function(table, callback){
		this.loadSchema(air.SQLTableSchema, table, function(schema){
			air.trace(schema.tables[0].name);
			callback(schema.tables[0].columns);
		});
	},

	onOpen: function(event){
		this.fireEvent('connect', event);
	},

	onError: function(event){
		this.fireEvent('error', event);
	}

});
