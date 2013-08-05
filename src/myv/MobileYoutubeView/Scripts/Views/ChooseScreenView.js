define(["$", "underscore", "backbone", "marionette", "text!Templates/ChooseScreenCollectionView.html", "text!Templates/ChooseScreenItemView.html"], function ($, _, Backbone, Marionette, CollectionTemplate, ItemTemplate) {
    var App = require("App");

    var ItemView = Backbone.Marionette.ItemView.extend({
        template: ItemTemplate,
        tagName: "a",
        className: "screen-option",
        events: {
            "click": "choose",
        },
        attributes: {
            href: "#"
        },
        choose: function () {
            App.trigger("remoteController:choose", this.model.get("Id"));

            return false;
        }
    });

    var CollectionView = Backbone.Marionette.CompositeView.extend({
        template: CollectionTemplate,
        tagName: "div",
        className: "choosescreen-view",
        itemView: ItemView
    });

    return CollectionView;
});