define(["$", "underscore", "backbone", "marionette", "text!Templates/RemoteControllerView.html", "text!Templates/RemoteControllerView-Item.html"], function ($, _, Backbone, Marionette, Template, ItemViewTemplate) {
    var App = require("App");

    var ItemView = Backbone.Marionette.ItemView.extend({
        template: ItemViewTemplate,
        onRender: function() {
            this.$el.attr("data-videoId", this.model.get("Id"));
        }
    });

    var View = Backbone.Marionette.CompositeView.extend({
        tagName: "div",
        className: "remote-controller",
        template: Template,
        itemView: ItemView,
        itemViewContainer: "#videoentry-container",
        events: {
            "click [data-videoId]": "sendVideoRequest",
            "keydown #txtSearch": "search"
        },
        sendVideoRequest: function (e) {
            var $target = $(e.target),
                videoId = $target.attr("data-videoId");

            App.hub.server.sendVideoRequest(videoId);
        },
        search: function (e) {
            var $target = $(e.target),
                query = $target.val();

            var that = this;

            searchDelayer(function () {
                require(["Collections/VideoEntryCollection"], function (VideoEntryCollection) {
                    var collection = new VideoEntryCollection();

                    collection.fetch({
                        data: $.param({ query: query }),
                        success: function () {
                            displayResults.call(that, collection)
                        }
                    });
                });
            }, 300, this);

        }
    });

    var displayResults = function (collection) {
        //var content = "<div>"

        //collection.each(function (videoEntry) {
        //    content += "<a href='#' data-videoId='" + videoEntry.get("Id") + "'>" + videoEntry.get("Title") + "</a><br />";
        //});

        //content += "</div>";

        //container.empty().html(content);
        this.collection = collection;
        this.render();
    };

    var searchDelayer = (function () {
        var timer = 0;
        return function (callback, ms, context) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.call(context);
            }, ms);
        }
    })();

    return View;
});