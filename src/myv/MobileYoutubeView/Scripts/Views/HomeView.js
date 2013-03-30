define(["$", "underscore", "backbone", "marionette", "text!Templates/HomeView.html"], function ($, _, Backbone, Marionette, Template) {
    var App = require("App");

    var View = Backbone.Marionette.ItemView.extend({
        template: Template,
        tagName: "div",
        ui: {
            btnViewMode: $("#btnViewMode"),
            btnRemoteMode: $("#btnRemoteMode")
        },
        events: {
            "click #btnViewMode": "viewMode",
            "click #btnRemoteMode": "remoteMode"
        },
        viewMode: function () {
            App.vent.trigger("views:show:viewer");
        },
        remoteMode: function () {
            App.vent.trigger("views:show:remoteController");
        }
    });

    return View;
});