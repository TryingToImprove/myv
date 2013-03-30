define(["$", "underscore", "backbone", "marionette", "text!Templates/RemoteControllerView.html"], function ($, _, Backbone, Marionette, Template) {
    var App = require("App");

    var View = Backbone.Marionette.ItemView.extend({
        template: Template,
        tagName: "div",
        events: {
            "click [data-videoId]": "sendVideoRequest"
        },
        sendVideoRequest: function (e) {
            var $target = $(e.target),
                videoId = $target.attr("data-videoId");
            
            App.hub.server.sendVideoRequest(videoId);
        }
    });

    return View;
});