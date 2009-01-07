new AppWindow('http://www.google.com', {bounds: {
	top: 400, left: 400
}});
new AppWindow('app:/Demos/AppWindow/second.html');
var win = new AppWindow('Content from a <code>string</code>. Closes after 10 seconds.', {
	systemChrome: false,
	type: 'lightweight',
	bounds: {
		top: 100, left: 100
	}
});
(function(){
	win.close();
}).delay(10000);
