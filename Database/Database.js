function $todo(msg){
	return function(){
		air.trace(msg);
	};
};

var Database = new Class({

	Implements: [Events, Options],

	options: {
		file: 'database.sqlite'
	},

	initialize: function(options){
		this.setOptions(options);
		var file = air.File.applicationDirectory.resolvePath(this.options.file);
		this.connection = new air.SQLConnection();
		this.connection.addEventListener('open', this.onOpen.bind(this));
		this.connection.addEventListener('error', this.onError.bind(this));
		this.connection.openAsync(file);
	},

	prepare: function(text, options){
		return new Query(this, text, options);
	},
	
	onOpen: function(event){
		this.fireEvent('connect', event);
	},

	onError: function(event){
		this.fireEvent('error', event);
	}

});

/*

Example:

var createUser = new Query(db, "INSERT INTO users(nick, name) VALUES (:nick, :name)");
createUser.execute({nick: 'JanK', name: 'Jan Kassens'});
createUser.execute({nick: 'tomocchino', name: 'Tom Occhino'});

*/

var Query = new Class({

	Implements: [Events, Options],

	options: {
	},

	initialize: function(database, text, options){
		var statement = new air.SQLStatement();
		statement.addEventListener('error', $todo('error'));
		statement.addEventListener('result', this.handleResult.bind(this));
		statement.sqlConnection = database.connection;
		statement.text = text;
		this.statement = statement;
	},

	execute: function(parameters){
		var statement = this.statement;
		statement.clearParameters();
		if ($type(parameters) == 'object'){
			Hash.each(parameters, function(key, value){
				statement.parameters[':' + key] = value;
			});
		} else {
			Array.flatten(arguments).each(function(key, value){
				statement.parameters[key] = value;
			});
		}
		this.statement.execute();
		return this;
	},

	handleResult: function(event){
		this.fireEvent('result', this.statement.getResult().data);
	}

});
