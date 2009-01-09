var fetch = function(host, port, message){
    message = message || "GET /";
    var socket = new Socket({host: host, port: port, autoConnect: true});
    
    socket.addEvent("connected", function() {
        socket.send(message);
    });
    
    socket.addEvent("data", function() {
        $(host+port+"response").set("text", socket.read());
        socket.close();
    });
    
    socket.addEvent("error", function(e) {
        $(host+port+"response").set("text", "Error: " + e.toString());
        socket.close();
    });
    
    var p = new Element('p').inject(document.body);
    new Element('div', {style: 'font-weight: bold', text: host + ':' + port + " " + message}).inject(p);
    var div = new Element('div', {
        id: host+port+"response", 
        text: "Loading Response...", 
        style: "overflow: auto; height: 100px; margin-top: 5px; padding: 5px; font-family: monospace; border: 1px solid #ccc;"
    }).inject(p);
};

window.addEvent('domready', function(){
    fetch("localhost", 80);
    fetch("google.com", 80);
    fetch("mootools.net", 80);
    fetch("twitter.com", 80, "GET /statuses/public_timeline.json");
    fetch("nowhere", 00);
});
