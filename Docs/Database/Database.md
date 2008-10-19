Class: Database
===============

Options
-------

* **file** - (*string*, defaults to "database.sqlite") Name of the database file to use.



Events
------

* **connect** - Fired when a database connection was successfully established.
* **error** - Fired when an error occurred while connection to the database.



Condition{#Condition}
---------------------

Condition can have various types. Note that parameters are always inserted as prepared statement parameters and never via string operations like .replace or string concatenation.

### null
No condition, is always true.

#### Example:
	null
	// WHERE 1

### string
Will directly used as a SQL WHERE clause.

#### Example:
	'sold > bought'
	// WHERE sold > bought

### object
An object with column/value pairs. All have to match.

#### Example:
	{first: 'Jan', last: 'Kassens'}
	// WHERE first = 'Jan' AND last = 'Kassens'

### array
An array of the form: `[string, param1, param2, param3]` or `[string, obj]`

#### Example:
	['friends < ? OR knowledge < ?', 5, 10]
	// WHERE friends < 5 OR knowledge < 10

	['friends < :friends OR knowledge < :knowledge', {friends: 5, knowledge: 10}]
	// WHERE friends < 5 OR knowledge < 10



Method: prepare
---------------

Prepares a [Database.Query][].

### Arguments:
1. **query** - (*string*) The query.
2. **params** - (*mixed*) Parameters for [Database.Query#execute][]
2. **options** - (*object*) passed to [Database.Query][].

### Returns:
(*[Database.Query][]*) A newly created Database.Query.

### Example:
	var query = db.query('SELECT users.nick, comment.title FROM users LEFT JOIN comments ON users.id = comments.user_id AND users.reputation > :min_reputation', {min_reputation: 250});



Method: query
-------------

Shortcut for `db.prepare(...).execute(...)`.

### Arguments:
1. **query** - (*string*) The query.

2. **options** - (*object*) passed to [Database.Query][].

### Returns:
(*[Database.Query][]*) A newly created Database.Query

### Example:
	var query = db.prepare('SELECT users.nick, comment.title FROM users LEFT JOIN comments ON users.id = comments.user_id AND users.reputation > :min_reputation');
	query.execute({min_reputation: 250});



Method: INSERT
--------------

Inserts data into a table.

### Arguments:
1. **table** - (*string*) The name of the table.
2. **data** - (*object*) The data to insert into the table.
3. **options** - (*object*) passed to [Database.Query][].

### Returns:
(*[Database.Query][]*) A newly created Database.Query

### Example:
	var query = db.INSERT('user', {nick: 'JanK', first: 'Jan', last: 'Kassens'}, {
		onSuccess: function(){
			air.trace('User created.');
		}
	});



Method: SELECT
--------------

Selects data from a table.

### Arguments:
1. **table** - (*string*) The name of the table.
2. **condition** - (*[Condition][]*) A condition.
3. **options** - (*object*) passed to [Database.Query][].

### Returns:
(*[Database.Query][]*) A newly created Database.Query.

### Example:
	var query = db.SELECT('user', ['balance > ?', 100], {
		limit: 1
		onSuccess: function(data){
			if (data) air.trace(data[0].nick + ' is quite rich!');
		}
	});



Method: UPDATE
--------------

Updates data in a table.

### Arguments:
1. **table** - (*string*) The name of the table.
2. **condition** - (*[Condition][]*) A condition.
3. **data** - (*object*) An object with new values.
4. **options** - (*object*) passed to [Database.Query][].

### Returns:
(*[Database.Query][]*) A newly created Database.Query.

### Example:
	var query = db.UPDATE('user', ['balance < ?', 10], {score: 0});



Method: DELETE
--------------

Deletes data from a table.

### Arguments:
1. **table** - (*string*) The name of the table.
2. **condition** - (*[Condition][]*) A condition.
3. **options** - (*object*) passed to [Database.Query][].

### Returns:
(*[Database.Query][]*) A newly created Database.Query.

### Example:
	var query = db.DELETE('user', 'balance < 0', {
		onSuccess: function(){
			air.trace('Deleted all users with negative balance');
		}
	});



[Condition]:#Condition
[Database.Query]:/Database/Database.Query
[Database.Query#execute]:/Database/Database.Query#Database.Query:execute
