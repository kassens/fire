new AppWindow('http://www.google.com');
new AppWindow('app:/Demos/AppWindow/second.html');
var win = new AppWindow('Content from a <code>string</code>. Closes after 10 seconds.');
(function(){
	win.close();
}).delay(10000);
