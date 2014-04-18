
"use strict";

var cfg     = require("./config"),
    ebp     = require("raw-body"),
    lib = {

    "configExpress": function (app) {

        app.use(function (req, res, next) {
            ebp(req, {
                length: req.headers["content-length"],
                limit: cfg.postLimit,
                encoding: "utf8"
            }, function (err, string) {
                if (err) { next(err); }
                req.body = JSON.parse(string);
                next();
            });
        });
    }
};

module.exports = lib;


