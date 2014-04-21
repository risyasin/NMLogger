"use strict";

/*jshint jquery:true */

var app = {};
app.fType = "any";
app.dLimit = 10;
app.dsp = $("#display");
app.socket = io.connect();
app.syntaxHl = function (json) {
    if (typeof json !== "string") { json = JSON.stringify(json, undefined, 3); }
    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = "number";
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = "key";
            } else {
                cls = "string";
            }
        } else if (/true|false/.test(match)) {
            cls = "boolean";
        } else if (/null/.test(match)) {
            cls = "null";
        }
        return "<span class=\"" + cls + "\">" + match + "</span>";
    });
};

app.updateUi = function () {
    $("#display>pre:gt(" + app.dLimit + ")").remove();
};

app.socket.on("display", function (data) {
    if (typeof data === "string") {
        if (data === "##clean_display##") { app.dsp.html(""); }
        app.dsp.prepend(data + "<br>");
    } else {
        app.dsp.prepend(JSON.stringify(data) + "<br>");
    }
    app.updateUi();
});

app.socket.on("logs", function (data) {
    if (app.fType === "any" || app.fType === "logs") {
        data = JSON.parse(data);
        app.dsp.prepend("<pre class='logs'>" + app.syntaxHl(data) + "</pre>");
        app.updateUi();
    }
});

app.socket.on("errors", function (data) {
    if (app.fType === "any" || app.fType === "errors") {
        data = JSON.parse(data);
        app.dsp.prepend("<pre class='errors'>" + app.syntaxHl(data) + "</pre>");
        app.updateUi();
    }
});

$("document").ready(function () {
    $("select.chosenselect").chosen({"width": "220px"}).on("change", function () {
        app[$(this).attr("id")] = $(this).val();
        app.updateUi();
    });
    app.updateUi();
});