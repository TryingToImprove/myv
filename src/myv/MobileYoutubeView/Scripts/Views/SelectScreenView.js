define(["$", "underscore", "backbone", "marionette", "text!Templates/SelectScreen-CollectionView.html", "text!Templates/SelectScreen-ItemView.html", "text!Templates/SelectScreen-Layout.html", "text!Templates/SelectScreen-EmptyScreenView.html", "text!Templates/SelectScreen-CreateScreenView.html"], function ($, _, Backbone, Marionette, CollectionTemplate, ItemTemplate, LayoutTemplate, EmptyScreenTemplate, CreateScreenTemplate) {
    
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
            App.trigger("screen:choose", this.model.get("Id"));

            return false;
        }
    });

    var EmptyScreenView = Backbone.Marionette.ItemView.extend({
        template: EmptyScreenTemplate
    });

    var CollectionView = Backbone.Marionette.CompositeView.extend({
        events: {
            "click #btn-CreateNew": "createNew",
            "click a.back": "toHomeScreen"
        },
        template: CollectionTemplate,
        tagName: "div",
        className: "choosescreen-view content-view-item",
        itemView: ItemView,
        itemViewContainer: "#items",
        emptyView: EmptyScreenView,
        cleanUp: function () {
            this.stopListening(this.collection, "add", this.render);
        },
        initialize: function (options) {
            this.controller = options.controller;
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
                this.listenTo(this.collection, "add", this.itemAdded);

                if (forceRender) {
                    this.render();
                }
            });
        },
        itemAdded: function() {
            this.render();
        },
        onShow: function () {
            App.trigger("data:screens:all:load");
        },
        createNew: function () {
            this.controller.showCreateScreen();
        },
        toHomeScreen: function(e) {
            App.trigger("views:show:home");

            e.preventDefault();
        }
    });

    var CreateScreenView = Backbone.Marionette.ItemView.extend({
        events: {
            "click a.back": "selectScreens",
            "submit": "createScreen"
        },
        ui: {
            txtScreenName: "input[name='txtScreenName']"
        },
        className: "content-view-item horizontal-form",
        tagName: "form",
        template: CreateScreenTemplate,
        initialize: function(options) {
            this.controller = options.controller;
        },
        createScreen: function(e) {
            require(["Models/ScreenModel"], $.proxy(function(ScreenModel) {
                var screen = new ScreenModel({
                    Name: this.ui.txtScreenName.val()
                });

                //Connect the screen
                App.trigger("data:screens:createNew", screen);
            }, this));
            
            e.preventDefault();
        },
        selectScreens: function(e) {
            this.controller.showSelectScreen();

            e.preventDefault();
        }
    });
    

    var SelectScreenController = Backbone.Marionette.Controller.extend({
        initialize: function (options) {
            this.area = options.area;
        },
        showSelectScreen: function() {
            this.area.show(new CollectionView({ controller: this }));
        },
        showCreateScreen: function() {
            this.area.show(new CreateScreenView({ controller: this }));
        }
    });

    return SelectScreenController;
});