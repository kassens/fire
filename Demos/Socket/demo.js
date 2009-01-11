var fetch = function(host, port, message){
	message = message || "GET /\n";
	var socket = new Socket({host: host, port: port, autoConnect: true});

	var p = new Element('p').inject(document.body);
	new Element('div', {style: 'font-weight: bold', text: host + ':' + port + " " + message}).inject(p);
	var log = new Element('div', {
		text: "Loading Response...",
		style: "overflow: auto; height: 100px; margin-top: 5px; padding: 5px; font-family: monospace; border: 1px solid #ccc;"
	}).inject(p);

	socket.addEvents({
		connect: function() {
			socket.send(message);
		},

		socketData: function() {
			log.set("text", socket.read());
			socket.close();
		},

		ioError: function(e) {
			log.set("text", "Error: " + e.toString());
			socket.close();
		},

		securityError: function(e) {
			log.set("text", "Error: " + e.toString());
			socket.close();
		}
	});
};

window.addEvent('domready', function(){
	fetch("localhost", 80);
	fetch("google.com", 80);
	fetch("mootools.net", 80);
	fetch("twitter.com", 80, "GET /statuses/public_timeline.json\n");
	fetch("nowhere", 00);
});
