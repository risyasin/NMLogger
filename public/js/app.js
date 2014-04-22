"use strict";

/*jshint jquery:true */

var app = {};
app.fType = "*";
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

app.socket.on("log", function (data) {
    console.log(["data:", data]);
    var sd = JSON.parse(data),
        ts = "<span class='tsd'>" + sd.time + "</span>";
    app.dsp.prepend("<pre class='logs " + sd.type + "'>" + app.syntaxHl(sd.data) + ts + "</pre>");
    app.updateUi();
});

$("document").ready(function () {
    $("select.chosenselect").chosen().on("change", function () {
        app[$(this).attr("id")] = $(this).val();
        app.updateUi();
    });
    app.updateUi();
});