var createTable = false;

window.addEvent('domready', function(){
	var select;
	var searchInput = $('search');
	var new_user_input = $("new_user");
	var updateList = function(){
		select.execute('%' + (searchInput.value || '%') + '%');
	};
	var db = new Database({
		onConnect: function(){
			if (createTable){
				db.prepare('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT)').execute();
			} else {
				db.loadTableSchema('user', function(columns){
					air.trace(columns[0].name);
					air.trace(columns[1].name);
				});
				// db.select('user', null, {limit: 1});
				// db.select('user', null, {limit: [3, 5]});
				// db.insert('user', {nick: 'mister x'}).execute({nick: 'jan'}).execute({nick: 'peter'});
				// db.update('user', {nick: 'john'}, {nick:'jon'});
				// db.DELETE('user', {nick: 'hugo'});
				select = db.select('user', ['nick LIKE ?', '%'], {
					onResult: function(result){
						var users = $('users').empty();
						if (!result){
							new Element('li', {text: 'no user found'}).inject(users);
							return;
						}
						// TODO: result doesn't have the mootools prototypes here? .each is undefined
						result.forEach(function(data){
							new Element('li', {
								text: data.nick,
								events: {
									click: function(){
										db.DELETE('user', {id: data.id}).chain(updateList);
									}
								}}).inject(users);
						});
					},
					onError: function(event){
						air.trace('error');
					}
				});
				$('search').addEvent('keyup', updateList);
				$('new_user_button').addEvent('click', function(){
					db.insert('user', {nick: new_user_input.get('value')}).chain(updateList);
					return false;
				});
			}
		}
	});
});
