var hashtable = require("./index.js");

var cluster = require("cluster");

var numCPUs = require('os').cpus().length;



if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCpus; i++) {
        cluster.fork();
    }
}



setInterval(function() {

    hashtable.get("key", function test2(data) {
        console.log("key->get->resp")
        console.log(data);
    });
    
    
}, 1000);
