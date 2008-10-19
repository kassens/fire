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

	parseCondition: function(condition){
		var clause = '1', parameters = [];
		switch ($type(condition)){
			case 'object':
				clause = Hash.getKeys(condition).join(' = ? AND ') + ' = ?';
				parameters = Hash.getValues(condition);
				break;
			case 'array':
				clause = condition[0];
				parameters = ($type(condition[1]) == 'object') ? condition[1] : condition.slice(1).flatten();
				break;
			case 'string':
				clause = condition;
		};
		return {clause: clause, parameters: parameters};
	},

	prepare: function(query, options){
		return new Database.Query(this, query, options);
	},

	query: function(query, params, options){
		return this.prepare(query, options).execute(params);
	},

	INSERT: function(table, data, options){
		var query = 'INSERT INTO ' + table + '(' + Hash.getKeys(data).join(',') + ') VALUES (:' + Hash.getKeys(data).join(', :') + ')';
		return this.query(query, data, options);
	},

	SELECT: function(table, condition, options){
		condition = this.parseCondition(condition);
		var query = 'SELECT * FROM ' + table + ' WHERE ' + condition.clause;
		return this.query(query, condition.parameters, options);
	},

	UPDATE: function(table, condition, data, options){
		condition = this.parseCondition(condition);
		var query = 'UPDATE ' + table + ' SET ' + Hash.getKeys(data).join(' = ?, ') + ' = ? WHERE ' + condition.clause;
		return this.query(query, Hash.getValues(data).extend(condition.parameters), options);
	},

	DELETE: function(table, condition, options){
		condition = this.parseCondition(condition);
		var query = 'DELETE FROM ' + table + ' WHERE ' + condition.clause;
		return this.query(query, condition.parameters, options);
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

(function(aliases){
	for (alias in aliases) Database.prototype[aliases[alias]] = Database.prototype[alias];
})({
	INSERT: 'insert',
	SELECT: 'select',
	UPDATE: 'update',
	DELETE: 'delete'
});
