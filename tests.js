var hashtable = require("./index.js");

var cluster = require("cluster");

var numCPUs = require('os').cpus().length;



if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    hashtable.set("key", "Yello");

}



setInterval(function() {

    hashtable.get("key", function stack(data) {
        console.log("key->get->resp")
        console.log(data);
    });
    
    
}, 1000);
