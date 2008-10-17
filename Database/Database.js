function $todo(){};

var Database = new Class({

	Implements: [Events, Options],

	options: {
		file: 'database.sqlite'
	},

	initialize: function(options){
		this.setOption(options);
		var file = air.File.applicationDirectory.resolvePath(this.options.file);
		this.db = new air.SQLConnection();
		this.db.addEventListener(air.SQLEvent.OPEN, $todo('connected'));
		this.db.open(file, air.SQLMode.READ); // or air.SQLMode.CREATE
	},

	prepare: function(text, options){
		return new Queryi(this, text, options);
	},
	
	query: function(text, options){
		return this.prepare(text, options).execute();
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
		statement.addEventListener(air.SQLErrorEvent.ERROR, $todo('error'));
		statement.addEventListener(air.SQLEvent.RESULT, $todo('result'));
		statement.sqlConnection = database;
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
	}

});