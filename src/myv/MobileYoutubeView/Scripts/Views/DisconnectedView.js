define(["$", "underscore", "backbone", "marionette", "text!Templates/DisconnectedView.html"], function ($, _, Backbone, Marionette, ItemTemplate) {
    var View = Marionette.ItemView.extend({
        template: ItemTemplate,
        events: {
            "click .close": "close"
        }
    });

    return View;
});