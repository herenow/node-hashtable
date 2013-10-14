var net = require("net");

module.exports = function(_port, _host) {
 
    var client = net.connect({port: _port, host: _host}, function() {

        console.log("Connected to server.");

        client.write(JSON.stringify({
            set: ['key', 'john'],
            get: ['key']
        }));
        
    });
    
    client.on("data", function (data) {
       
       data = JSON.parse(data);
       
       console.log("Server -> ");
       console.log(data);
        
    });
    
}