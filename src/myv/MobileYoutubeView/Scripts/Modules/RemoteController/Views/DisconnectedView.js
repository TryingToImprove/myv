define(["$", "underscore", "backbone", "marionette", "text!RemoteController/Templates/DisconnectedView.html"], function ($, _, Backbone, Marionette, ItemTemplate) {
    var App = require("App");

    var View = Marionette.ItemView.extend({
        template: ItemTemplate,
        events: {
            "click .close": "closeModal"
        },
        closeModal: function() {
            App.closeModal();
        }
    });

    return View;
});