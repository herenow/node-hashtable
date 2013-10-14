var net = require("net");
var cluster = require("cluster");

var port = 0;
var host = "localhost";

var hashTable = require('./hashtable.js');


if (cluster.isMaster) {
    
        /* Test childs */
        for (var i = 0; i < 4; i++) {
            cluster.fork();
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
            
        });
        
        server.listen(port, host);
       
}


function client_open() {
    if(port === 0)
        setTimeout(client_open, 100);
    else
        require("./client.js")(port, host);
}
client_open();
    
    