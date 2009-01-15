Element.Properties.storage = {
	set: function(obj){
		for (key in obj) this.store(key, obj[key]);
	}
};

var createTable = false;

window.addEvent('domready', function(){
	var select;
	var searchInput = $('search');
	var updateList = function(){
		select.execute('%' + (searchInput.value || '%') + '%');
	};
	var db = new Database({
		onConnect: function(){
			db.query('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT)');
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
							storage: {
								'user:id': data.id
							}
						}).inject(users);
					});
				},
				onError: function(event){
					air.trace('error');
				}
			});
			$('users').addEvent('click(li)', function(){
				db.DELETE('user', {id: this.retrieve('user:id')}).chain(updateList);
			});
			$('search').addEvent('keyup', updateList);
			$('new_user_button').addEvent('click', function(){
				db.insert('user', {nick: $("new_user").get('value')}).chain(updateList);
				return false;
			});
		}
	});
});
