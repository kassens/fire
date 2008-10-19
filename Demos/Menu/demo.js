window.addEvent('domready', function(){
	var el = $('context');
	
	var textSetter = function(text){
		return el.set.bind(el, ['text', text]);
	};
	
	var menu = new Menu();
	menu.addItem('foo', textSetter('foo selected'));
	menu.addItem('bar', textSetter('bar selected'));
	
	menu.addSeperator();
	var sub = new Menu();
	sub.addItem('xx', textSetter('xx selected'));
	sub.addItem('yy', textSetter('yy selected'));
	menu.addSubmenu('my sub', sub);
	
	el.setContextMenu(menu);
});
