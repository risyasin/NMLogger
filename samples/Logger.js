/**
 * SCVLogger Client for JS
 * Example usage:
 *
    $.Logger({ my_action_to_log: 'whatever' });

    // OR

    $(".my_button").click(function () {
        $.Logger({ my_action_to_log: 'whatever' });
    });

 *
 */

(function ($) {
    "use strict";
    $.Logger = function Logger(data, type) {
        type = type || "info";
        data = data || { status: "no-data" };
        data["url"] = window.location.href;
        if (typeof data["ua"] === "undefined") { data["ua"] = $.browser || {}; }
        $.ajax({ url: "//localhost:8081/log/" + type, type: "POST", data: JSON.stringify(data), dataType: "json" });
    };
})(jQuery);
