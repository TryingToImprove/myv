﻿define(["$", "underscore", "backbone", "marionette", "text!Templates/HomeView.html"], function ($, _, Backbone, Marionette, Template) {
    var App = require("App");

    var View = Backbone.Marionette.ItemView.extend({
        template: Template,
        tagName: "div",
        className: "home-view",
        ui: {
            btnViewMode: $("#btnViewMode"),
            btnRemoteMode: $("#btnRemoteMode")
        },
        events: {
            "click #btnViewMode": "viewMode",
            "click #btnRemoteMode": "remoteMode"
        },
        viewMode: function () {
            App.hub.server.requestScreens("screen:start");
        },
        remoteMode: function () {
            App.hub.server.requestScreens("views:show:chooseScreenView");
        }
    });

    return View;
});