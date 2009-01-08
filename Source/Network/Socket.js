Socket = new Class({
    
    Implements: [Events, Options],
    
    options: {
        host: "127.0.0.1",
        port: 8000,
        persistent: false,
        endian: "bigEndian",
        autoConnect: false,
    },
    
    accessors: {
      "boolean": "Boolean",
      "byte": "Byte",
      "bytes": "Bytes",
      "double": "Double",
      "float": "Float",
      "int": "Int",
      "multibyte": "MultiByte",
      "object": "Object",
      "short": "Short",
      "unsignedbyte": "UnsignedByte",
      "unsignedint": "UnsignedInt",
      "unsignedshort": "UnsignedShort",
      "utf": "UTF",
      "utfbytes": "UTFBytes"
    },
    
    initialize: function (options) {
        this.setOptions(options);
        
        this.socket = new air.Socket();
        this.endian();
        this.socket.addEventListener(air.Event.CLOSE, this.onClose.bind(this));
        this.socket.addEventListener(air.Event.CONNECT, this.onConnected.bind(this));
        this.socket.addEventListener(air.IOErrorEvent.IO_ERROR, this.onError.bind(this));
        this.socket.addEventListener(air.SecurityErrorEvent.SECURITY_ERROR, this.onError.bind(this));
        this.socket.addEventListener(air.ProgressEvent.SOCKET_DATA, this.onData.bind(this));
        
        this.response = "";
        
        if (this.options.autoConnect) this.connect();
    },
    
    endian: function (type) {
        if (type) this.options.endian = (type == "little") ? "littleEndian" : "bigEndian";
        this.socket.endian = this.options.endian;
    },
    
    connected: function() {
        return this.socket.connected;
    },
    
    connect: function (host, port) {
        this.options.host = host || this.options.host;
        this.options.port = port || this.options.port;
        
        this.socket.connect(this.options.host, this.options.port);
        this.onConnect(this);
    },
    
    persist: function() {
        if (this.options.persistent && !this.socket.connected) this.connect();
    },
    
    write: function (data, type) {
        this.persist();
        
        type = (type) ? String.toLowerCase(type) : "utfbytes";
        var writer = this.socket["write" + this.accessors[type]];
        
        if (type == "utfbytes") data += "\n";
        
        try {
            writer(data)
        } catch (e) {
            this.onError(e);
        }
    },
    
    flush: function () {
        this.persist();
        this.socket.flush();
        this.response = "";
    },
    
    send: function (data, type) {
        this.write(data, type);
        this.flush();
        air.trace("Send");
    },
    
    read: function (type, args) {
        this.persist();
        
        type = (type) ? String.toLowerCase(type) : "utfbytes";
        args = args || this.socket.bytesAvailable;
        var reader = this.socket["read" + this.accessors[type]];
        
        try {
            this.response = reader(args);
        } catch (e) {
            this.onError(e);
        }
        
        return this.response;
    },
    
    close: function () {
        this.socket.close();
    },
    
    onConnect: function () {
        this.fireEvent("connect", arguments);
    },
    
    onConnected: function () {
        this.fireEvent("connected", arguments);
    }
        
    onError: function () {
        this.fireEvent("error", arguments);
    },
    
    onData: function () {
        this.fireEvent("data", arguments);
    },
    
    onClose: function () {
        this.fireEvent("close", arguments);
        this.persist();
    }
});