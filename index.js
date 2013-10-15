var net = require("net");
var cluster = require("cluster");

var port = 0;
var host = "localhost";

var hashTable = require('./hashtable.js');

var client = require("./client.js");

module.exports = client.exchange;

if (cluster.isMaster) {
        /* If he is master, dont need to access throught client */
        //module.exports = hashTable;
    
        /* Test childs */
        var workers = [];
        for (var i = 0; i < 4; i++) {
            workers.push(cluster.fork());
        }

        cluster.on('exit', function(worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died');
        });
    
       /* Create the exchange server */
        var server = net.createServer(function(c) {
            
            console.log('Client connected');
            
            
            c.on("data", function(data){
                
                data = JSON.parse(data);
                
                var resp = [];
                
                for(var prop in data) {
                    resp.push( hashTable[prop].apply(undefined, data[prop]) );
                }
                
                c.write(JSON.stringify(resp));
                
            });
            
        });
        
        server.on("listening", function() {
            
            port = server.address().port;
            
            for(var i in workers) {
                workers[i].send(port);
            }
            
        });
        
        server.listen(port, host);
}
else {
    //module.exports = client.exchange;
    
    process.on('message', function(port) {
        client(port, host);
    })
}
    