
"use strict";

var cfg     = require("./config"),
    ebp     = require("raw-body"),
    lib = {
        "configExpress": function (app) {
            app.use(function (req, res, next) {
                var parsed = {};
                ebp(req, {
                    length: req.headers["content-length"],
                    limit: cfg.postLimit,
                    encoding: "utf8"
                }, function (err, string) {

                    if (typeof string === "string" && string.length > 1) { parsed = JSON.parse(string); }

                    console.log(["string", string, typeof string, string.length, parsed]);
                    req.body = parsed;
                    next();
                });
            });
        }
    };


module.exports = lib;


