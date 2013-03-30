define(["$", "underscore", "backbone", "marionette", "text!Templates/RemoteControllerView.html"], function ($, _, Backbone, Marionette, Template) {
    var App = require("App");

    var View = Backbone.Marionette.ItemView.extend({
        template: Template,
        tagName: "div"
    });

    return View;
});