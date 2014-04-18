
"use strict";

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.json({"status": "Logger API running!"});
    });

    app.post("/log", function (req, res) {
        app.saveLog("logs", req.body);
        res.json({"status": "Ok"});
    });

    app.post("/error", function (req, res) {
        app.saveLog("errors", req.body);
        res.json({"status": "Ok"});
    });

    app.post("/stat", function (req, res) {
        app.saveLog("stats", req.body);
        res.json({"status": "Ok"});
    });

    app.post("/test", function (req, res) {
        app.saveLog("tests", req.body);
        res.json({"status": "Ok"});
    });

};