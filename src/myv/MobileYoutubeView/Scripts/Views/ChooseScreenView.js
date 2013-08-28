define(["$", "underscore", "backbone", "marionette", "text!Templates/ChooseScreen-CollectionView.html", "text!Templates/ChooseScreen-ItemView.html", "text!Templates/ChooseScreen-EmptyView.html"], function ($, _, Backbone, Marionette, CollectionTemplate, ItemTemplate, EmptyScreenTemplate) {
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

    var EmptyScreenView = Backbone.Marionette.ItemView.extend({
        template: EmptyScreenTemplate
    });

    var CollectionView = Backbone.Marionette.CompositeView.extend({
        events: {
            "click a.back": "toHomeScreen"
        },
        emptyView: EmptyScreenView,
        template: CollectionTemplate,
        tagName: "div",
        className: "choosescreen-view content-view-item ",
        itemViewContainer: "#items",
        itemView: ItemView,
        cleanUp: function () {
            this.stopListening(this.collection, {
                "add": this.render,
                "remove": this.render
            });
        },
        initialize: function () {
            this.listenTo(App, "data:screens:currentConnected", function () {
                var screenCollection = App.Data.Screens,
                    forceRender = true;

                //Check if it is the first time, if it is not then we want to perform some cleanup
                if (this.collection) {
                    //Clean up old event listeners
                    this.cleanUp();

                    forceRender = false;
                }

                //Set the new collection
                this.collection = screenCollection;

                //Add eventlisteners to the view for the collection
                this.listenTo(this.collection, {
                    "add": this.render,
                    "remove": this.render
                });

                if (forceRender) {
                    this.render();
                }
            });
        },
        onShow: function () {
            App.trigger("data:screens:all:load");
        },
        toHomeScreen: function (e) {
            App.trigger("views:show:home");

            e.preventDefault();
        }
    });

    return CollectionView;
});