var net = require("net");

var hashTable = require("./hashtable.js");

var client;

var callback = [];


module.exports = function _client(_port, _host) {
 
    client = net.connect({port: _port, host: _host}, function() {

        console.log("Connected to hashtable server.");
        
    });
    
    client.on("data", function (json) {
       
       json = JSON.parse(json);
       
       if(callback[json._id]) {
            callback[json._id](json.data);
            callback[json._id] = null;
       }

    });
    
};


/* Dynamic */

var exchange = [];

function create_fnc(verb) {
    
    return function(key, data, fnc) {
        
        var _id = Math.random() + new Date().getTime();
        var json = {};
        
        if(typeof data === "function") {
            fnc = data;
            json[verb] = { _id: _id, args: [key] };
        }
        else if(data) {
            json[verb] = { _id: _id, args: [key, data] };
        }
        else {
            json[verb] = { _id: _id, args: [key] };
        }

        callback[_id] = fnc;
        
        client.write(JSON.stringify(json));
        
    };
    
}

for(var i in hashTable) {
    
    exchange[i] = create_fnc(i);

}

module.exports.exchange = exchange;
