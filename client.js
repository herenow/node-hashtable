var net = require("net");

var hashTable = require("./hashtable.js");

var client;

module.exports = function _client(_port, _host) {
 
    var client = net.connect({port: _port, host: _host}, function() {

        console.log("Connected to hashtable server.");
        
    });
    
    client.on("data", function (data) {
       
       data = JSON.parse(data);
       
       console.log("Server -> ");
       console.log(data);
        
    });
    
}


/* Dynamic */

var exchange = [];

function create_fnc(verb) {
    
    return function(key, data) {
        
        var data = {};
        
        data[verb] = [key, data]
        
        client.write(JSON.stringify(data)); 
        
    };
    
}

for(var i in hashTable) {
    
    exchange[i] = create_fnc(i);

}

module.exports.exchange = exchange;
