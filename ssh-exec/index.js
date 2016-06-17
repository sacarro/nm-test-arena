// jshint node:true
// jshint unused:true
"use strict";


var args = require("yargs").argv;
var debug = require("debug")("ssh-output");
var SshClient = require("ssh2").Client;

var connection = new SshClient();
connection.on("ready", function() {
    console.log("Connection established");
    connection.shell(function shell(err, stream) {

        if (err) {
            throw err;
        }

        debug("Shell started");

        stream.on('close', function() {
            console.log('Stream :: close');
            connection.end();
        }).on('data', function(data) {
            debug("STDOUT: %s", data);
        }).stderr.on('data', function(data) {
            debug("STDERR: %s", data);
        });
        stream.end("shopt -s huponexit\n" + args.command + "\n");

    });

});


connection.connect({
    host: args.host,
    username: args.username,
    password: args.password
});

setTimeout(function() {
    connection.end();
}, 15000);
