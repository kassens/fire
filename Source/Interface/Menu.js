var Menu = new Class({

	initialize: function(){
		this.menu = new air.NativeMenu();
	},

	addItem: function(label, callback){
		var item = new air.NativeMenuItem(label);
		if (callback) item.addEventListener('select', callback, false);
		this.menu.addItem(item);
		return this;
	},
	
	addSubmenu: function(label, menu){
		this.menu.addSubmenu(menu.menu, label);
	},

	addSeperator: function(){
		this.menu.addItem(new air.NativeMenuItem('', true));
	},
	
	display: function(x, y){
		this.menu.display(window.htmlLoader.stage, x, y);
	}
	
});

Element.implement({

	setContextMenu: function(menu){
		this.addEventListener('contextmenu', function(event){
			menu.display(event.x, event.y);
			event.preventDefault();
			event.stopPropagation();
		}, false);
	}

});
