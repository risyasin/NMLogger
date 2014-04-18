/**
 * Created by yasin on 4/18/14.
 */

"use strict";

var cfg     = require("./config"),
    lib     = require("./lib"),
    express = require("express"),
    async   = require("async"),
    mc      = require("mongodb").MongoClient,
    app = express();


app.log = function (log) {
    console.log(log);
};

app.saveLog = function (type, data) {
    var db = app.mongo.collection(type);
    db.insert(data, function (err) {
        if (err) { throw err; }
        // ignore for a while!
    });
};

app.start = function (cb) {
    var ready = {};
    // mongo til it dies!
    ready["mongo"] = function (tcb) {
        mc.connect(cfg.mongo.uri, {}, function (err, db) {
            if (err) { throw err; }
            app.mongo = db;
            tcb(null, true);
        });
    };

    ready["express"] = function (tcb) {
        lib.configExpress(app);
        require("./routes")(app);
        tcb(null, true);
    };

    ready["run"] = function (tcb) {
        var server = app.listen(cfg.port, function () {
            app.log("Logger API started on port " + server.address().port);
            tcb(null, true);
        });
    };

    async.series(ready, function (err, res) {
        if (err) { throw err; }
        if (typeof cb === "function") { cb(res); }
    });

};

app.start();

process.on("uncaughtException", function (err) {
    console.log(["uncaughtException", err]);
});