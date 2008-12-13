window.addEvent('domready', function(){
	new SubWindow('http://www.google.com');
	new SubWindow('app:/Demos/SubWindow/second.html');
	var win = new SubWindow('Content from a <code>string</code>. Closes after 10 seconds.');
	(function(){
		win.close();
	}).delay(10000);
});
