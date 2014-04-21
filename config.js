
"use strict";

var cfg = {
    mongo: {
        uri: "mongodb://127.0.0.1:27017/scvlogger"
    },
    "port": 8081,
    "postLimit": "128mb",
    "auth": {
        "users": {
            "yasin": "33",
            "yunus": "123",
            "ugur": "123",
            "scv": "123"
        }
    }
}, os = require("os");

if (os.hostname() === "yasmbp") {
    cfg.mongo.uri = "mongodb://127.0.0.1:27017/scvlogger";
}

module.exports = cfg;
