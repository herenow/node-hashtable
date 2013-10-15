var net = require("net");
var cluster = require("cluster");

var port = 0;
var host = "localhost";

var hashTable = require('./hashtable.js');

var client = require("./client.js");


if (cluster.isMaster) {
        /* If he is master, dont need to access throught client */
        module.exports = hashTable;
    
        /* Create the exchange server */
        var server = net.createServer(function(c) {
            
            console.log('Client connected');
            
            
            c.on("data", function(data){
                
                data = JSON.parse(data);
                
                for(var prop in data) {
                    
                    var json = {
                        _id: data[prop]._id,
                        data: hashTable[prop].apply(undefined, data[prop].args) || null
                    }

                    c.write(JSON.stringify(json));
        
                }
                
            });
            
        });
        
        cluster.on('online', function(worker) {
            (function wait_exchange_server() {
                if(port !== 0) {
                    worker.send(port);
                }
                else {
                    setTimeout(function() { wait_exchange_server() }, 100);
                }
            })();
        });
        
        server.on("listening", function() {
            
            port = server.address().port;
            
        });
        
        server.listen(port, host);
}
else if (cluster.isWorker) {
    /* Special exchange service to get to main hashtable worker */
    module.exports = client.exchange;
    
    process.on('message', function(port) {
        client(port, host);
    })
}