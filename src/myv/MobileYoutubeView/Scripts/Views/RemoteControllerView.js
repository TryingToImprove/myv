define(["$", "underscore", "backbone", "marionette", "text!Templates/RemoteControllerView.html"], function ($, _, Backbone, Marionette, Template) {
    var App = require("App");

    var View = Backbone.Marionette.ItemView.extend({
        template: Template,
        tagName: "div",
        events: {
            "click [data-videoId]": "sendVideoRequest",
            "keydown #txtSearch": "search"
        },
        ui: {
            "container": "#videoentry-container"
        },
        sendVideoRequest: function (e) {
            var $target = $(e.target),
                videoId = $target.attr("data-videoId");

            App.hub.server.sendVideoRequest(videoId);
        },
        search: function (e) {
            var $target = $(e.target),
                query = $target.val(),
                $container = this.ui.container;

            searchDelayer(function () {
                require(["Collections/VideoEntryCollection"], function (VideoEntryCollection) {
                    var collection = new VideoEntryCollection();

                    collection.fetch({
                        data: $.param({ query: query }),
                        success: function () {
                            displayResults($container, collection)
                        }
                    });
                });
            }, 300, this);

        }
    });

    var displayResults = function (container, collection) {
        var content = "<div>"

        collection.each(function (videoEntry) {
            content += "<a href='#' data-videoId='" + videoEntry.get("Id") + "'>" + videoEntry.get("Title") + "</a><br />";
        });

        content += "</div>";

        container.empty().html(content);
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