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

	prepare: function(query, options){
		return new Database.Query(this, query, options);
	},

	query: function(query, params, options){
		return this.prepare(query, options).execute(params);
	},

	insert: function(table, data, options){
		var query = "INSERT INTO " + table + "(" + Hash.getKeys(data).join(',') + ") VALUES (:" + Hash.getKeys(data).join(', :') + ")";
		return this.query(query, data, options);
	},

	loadSchema: function(type, name, callback){
		this.connection.loadSchema(type, name, 'main', true, new air.Responder(callback, this.onError.bind(this)));
		return this;
	},

	loadTableSchema: function(table, callback){
		this.loadSchema(air.SQLTableSchema, table, function(schema){
			air.trace(schema.tables[0].name);
			callback(schema.tables[0].columns);
		});
		return this;
	},

	onOpen: function(event){
		this.fireEvent('connect', event);
	},

	onError: function(event){
		this.fireEvent('error', event);
	}

});
