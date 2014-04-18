
"use strict";

var cfg         = require("./config"),
    express     = require("express"),
    jsonBody    = require("raw-body"),
    auth        = require("http-auth"),
    _           = require("underscore"),
    lib = {
        "configExpress": function (app) {
            app.use(function (req, res, next) {
                var parsed = {};
                jsonBody(req, {
                    length: req.headers["content-length"],
                    limit: cfg.postLimit,
                    encoding: "utf8"
                }, function (err, string) {
                    // required check for body parser
                    if (typeof string === "string" && string.length > 1) { parsed = JSON.parse(string); }
                    req.body = parsed;
                    next();
                });
            });
            // static files
            app.use(express.static(__dirname + '/public'));

            app.set("views", "./views");

            app.set("view engine", "jade");

            app.requireAuth = auth.basic({ realm: "SCVLogger"
                }, function (user, pass, callback) { // Custom authentication method.
                    if (_.has(cfg.auth.users, user) && pass === cfg.auth.users[user]) {
                        app.auth = { "user": user, "loginTime": Date.now() };
                        callback(true);
                    } else {
                        app.log("login:" + user + " : " + pass);
                        callback(false);
                    }
                }
            );

            // app.use(auth.connect(app.requireAuth));
            // app.all("/log", app.requireAuth);
        }
    };


module.exports = lib;


