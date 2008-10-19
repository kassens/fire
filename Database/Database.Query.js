Database.Query = new Class({

	Implements: [Events, Options],

	options: {
		limit: false
	},

	initialize: function(database, query, options){
		this.setOptions(options);
		var statement = new air.SQLStatement();
		statement.addEventListener('error', this.onError.bind(this));
		statement.addEventListener('result', this.onResult.bind(this));
		statement.sqlConnection = database.connection;
		if (this.options.limit) query += ' LIMIT ' + $splat(this.options.limit).join(', ');
		statement.text = query;
		this.statement = statement;
	},

	execute: function(parameters){
		var statement = this.statement;
		if (statement.executing) return; // TODO: should implement Chain and use it like Fx
		statement.clearParameters();
		if ($type(parameters) == 'object'){
			Hash.each(parameters, function(value, key){
				statement.parameters[':' + key] = value;
			});
		} else {
			Array.flatten(arguments).each(function(value, key){
				statement.parameters[key] = value;
			});
		}
		this.statement.execute();
		return this;
	},

	onResult: function(event){
		this.fireEvent('result', this.statement.getResult().data);
	},

	onError: function(event){
		this.fireEvent('error', event);
	}

});
