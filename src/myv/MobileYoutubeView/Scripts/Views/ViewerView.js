define(["$", "underscore", "backbone", "marionette", "text!Templates/ViewerView.html"], function ($, _, Backbone, Marionette, Template) {
    var App = require("App");

    var View = Backbone.Marionette.ItemView.extend({
        template: Template,
        tagName: "div",
        events: {
            "click [data-videoId]": "sendVideoRequest"
        },
        ui: {
            player: "#player"
        },
        initialize: function () {
            this.listenTo(App, "video:change", function (videoId) {
                this.ui.player.attr("src", "http://www.youtube.com/embed/" + videoId + "?autoplay=1");
            });
        }
    });

    return View;
});