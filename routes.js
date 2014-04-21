
"use strict";

var cfg         = require("./config");

var pageTemplate = function (req, res, app, ptype) {
    res.render(ptype, {
        "data": app,
        "config": cfg
    });
};


module.exports = function (app) {

    app.route("/").get(function (req, res) {
        res.json({"status": "Logger API running!"});
    });

    app.route("/logs") //
        .get(function (req, res) {
            pageTemplate(req, res, app, "index.jade");
            app.slog({"message": "welcome!"});
        })
        .post(function (req, res) {
            pageTemplate(req, res, app, "index.jade");
        });


    app.post("/log/:type", function (req, res) {
        var type = req.params.type || "info";
        app.saveLog(type, req.body);
        res.json({"status": "Ok"});
    });

    app.post("/test", function (req, res) {
        app.saveLog("tests", req.body);
        res.json({"status": "Ok"});
    });

};