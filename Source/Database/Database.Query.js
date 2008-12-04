Database.Query = new Class({

	Implements: [Events, Options, Chain],

	options: {
		link: 'chain',
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

	check: function(caller){
		if (!this.statement.executing) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(caller.bind(this, Array.slice(arguments, 1))); return false;
		}
		return false;
	},

	execute: function(parameters){
		if (!this.check(arguments.callee, parameters)) return this;
		var statement = this.statement;
		if (statement.executing) return;
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
		this.callChain();
	},

	onError: function(event){
		this.fireEvent('error', event);
	}

});
