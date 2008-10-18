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
				var select = db.prepare("SELECT * FROM user", {
					onResult: function(result){
						result.map(function(data){
							new Element('div', {text: data.nick}).inject(document.body);
						});
					},
					onError: function(event){
						air.trace('error');
					}
				});
				select.execute();
			}
		}
	});
});