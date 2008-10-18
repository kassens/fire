Database.Query = new Class({

	Implements: [Events, Options],

	options: {
	},

	initialize: function(database, text, options){
		this.setOptions(options);
		var statement = new air.SQLStatement();
		statement.addEventListener('error', this.onError.bind(this));
		statement.addEventListener('result', this.onResult.bind(this));
		statement.sqlConnection = database.connection;
		statement.text = text;
		this.statement = statement;
	},

	execute: function(parameters){
		var statement = this.statement;
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

Database.Query.Insert = new Class({

	Extends: Database.Query,

	initialize: function(database, table, options){
		this.table = table;
		this.parent(database, '', options);
	},

	execute: function(obj){
		this.statement.text = "INSERT INTO " + this.table + "(" + Hash.getKeys(obj).join(',') + ") VALUES (:" + Hash.getKeys(obj).join(', :') + ")";
		return this.parent(obj);
	}

});
