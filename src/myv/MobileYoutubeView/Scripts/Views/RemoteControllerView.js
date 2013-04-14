﻿define(["$", "underscore", "backbone", "marionette", "text!Templates/RemoteControllerView.html", "text!Templates/RemoteControllerView-Item.html", "text!Templates/RemoteControllerView-Layout.html", "text!Templates/RemoteControllerView-Search.html"], function ($, _, Backbone, Marionette, Template, ItemViewTemplate, LayoutTemplate, SearchTemplate) {
    var App = require("App");

    var Layout = Backbone.Marionette.Layout.extend({
        template: LayoutTemplate,
        tagName: "div",
        className: "remote-controller",
        regions: {
            search: "#remoteController-search-area",
            content: "#remoteController-content-area"
        },
        onShow: function () {
            this.search.show(new SearchView());
            this.content.show(new CollectionView());
        }
    });

    var ItemView = Backbone.Marionette.ItemView.extend({
        template: ItemViewTemplate,
        tagName: "section",
        events: {
            "click": "sendVideoRequest"
        },
        sendVideoRequest: function (e) {

            var videoId = this.model.get("Id");

            //Send request to the server
            App.hub.server.sendVideoRequest(videoId);
        },
    });

    var SearchView = Backbone.Marionette.ItemView.extend({
        template: SearchTemplate,
        events: {
            "keyup #txtSearch": "search"
        },
        search: function (e) {
            var $target = $(e.target),
                query = $target.val();

            searchDelayer(function () {
                require(["Collections/VideoEntryCollection"], function (VideoEntryCollection) {
                    var collection = new VideoEntryCollection();

                    collection.fetch({
                        data: $.param({ query: query }),
                        success: function () {
                            App.trigger("search:collection:change", collection);
                        }
                    });
                });
            }, 300, this);
        }
    });

    var CollectionView = Backbone.Marionette.CompositeView.extend({
        tagName: "div",
        className: "video-entries",
        template: Template,
        itemView: ItemView,
        initialize: function () {
            this.listenTo(App, "search:collection:change", function (collection) {
                this.collection = collection;

                this.render();
            });
        }
    });

    //A function which make sure you are finish writing before it contiunes (input, keydown)
    var searchDelayer = (function () {
        var timer = 0;
        return function (callback, ms, context) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.call(context);
            }, ms);
        };
    })();

    return Layout;
});