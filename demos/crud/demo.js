var createTable = false;

window.addEvent('domready', function(){
	var db = new Database({
		onConnect: function(){
			if (createTable){
				db.prepare('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT)').execute();
			} else {
				db.loadTableSchema('user', function(columns){
					air.trace(columns[0].name);
					air.trace(columns[1].name);
				});
				// db.insert('user', {nick: 'john'});
				// db.update('user', {nick: 'john'}, {nick:'jon'});
				var select = db.select('user', ['nick LIKE ?', '%'], {
					onResult: function(result){
						var users = $('users').empty();
						if (!result){
							new Element('li', {text: 'no user found'}).inject(users);
							return;
						}
						// TODO: result doesn't have the mootools prototypes here? .each is undefined
						result.forEach(function(data){
							new Element('li', {text: data.nick}).inject(users);
						});
					},
					onError: function(event){
						air.trace('error');
					}
				});
				$('search').addEvent('keyup', function(){
					select.execute('%' + (this.value || '%') + '%');
				});
			}
		}
	});
});
