define(["$", "underscore", "backbone", "marionette", "text!Templates/RemoteControllerView.html", "text!Templates/RemoteControllerView-Item.html", "text!Templates/RemoteControllerView-Layout.html", "text!Templates/RemoteControllerView-Search.html", "text!Templates/RemoteControllerView-Loading.html", "text!Templates/RemoteControllerView-Bottom.html"], function ($, _, Backbone, Marionette, Template, ItemViewTemplate, LayoutTemplate, SearchTemplate, LoadingTemplate, BottomBarTemplate) {
    var App = require("App");

    var Layout = Backbone.Marionette.Layout.extend({
        template: LayoutTemplate,
        tagName: "div",
        className: "remote-controller",
        regions: {
            search: "#remoteController-search-area",
            content: "#remoteController-content-area",
            bottom: "#remoteController-bottom-area"
        },
        onShow: function () {
            this.search.show(new SearchView());
            this.content.show(new CollectionView());
            this.bottom.show(new BottomBarView());
        },
        initialize: function () {
            this.listenTo(App, "state:loading", function () {
                this.content.show(new LoadingView());
            });

            this.listenTo(App, "search:collection:change", function (collection) {
                this.content.show(new CollectionView({
                    collection: collection
                }));
            });
        }
    });

    var BottomBarView = Backbone.Marionette.ItemView.extend({
        template: BottomBarTemplate,
        tagName: "aside",
        className: "playing-container",
        ui: {
            content: ".content",
            options: ".options"
        },
        events: {
            "click .options > .dots": "openContent"
        },
        initialize: function () {
            this.listenTo(App, "video:request", function (video) {
                var that = this;

                require(["Models/VideoEntryModel"], function (VideoEntryModel) {
                    that.model = new VideoEntryModel(video);

                    that.render();
                });
            });
        },
        onRender: function() {
            if (this.isContentOpen) {
                this.ui.content.show();
            }            
        },
        isContentOpen: false,
        openContent: function () {
            var optionsHeight = this.ui.options.outerHeight(true),
                contentHeight;

            //TODO: MAKE BETTER PAUSE
            App.hub.server.sendPauseRequest();

            if (this.isContentOpen) {
                this.ui.content.hide();
                this.$el.height(optionsHeight + "px");
            } else {
                this.ui.content.show();

                contentHeight = this.ui.content.outerHeight(true);

                this.$el.height((optionsHeight + contentHeight) + "px");
            }

            this.isContentOpen = !this.isContentOpen;
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
        tagName: "form",
        events: {
            "submit": "search"
        },
        ui: {
            txtSearch: "#txtSearch"
        },
        search: function (e) {
            var query = this.ui.txtSearch.val();

            //We want to display loading screen here! 
            App.trigger("state:loading");

            require(["Collections/VideoEntryCollection"], function (VideoEntryCollection) {
                var collection = new VideoEntryCollection();

                collection.fetch({
                    data: $.param({ query: query }),
                    success: function () {
                        App.trigger("search:collection:change", collection);
                    }
                });
            });

            return false;
        }
    });

    var CollectionView = Backbone.Marionette.CompositeView.extend({
        tagName: "div",
        className: "video-entries",
        template: Template,
        itemView: ItemView
    });

    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: LoadingTemplate
    });

    return Layout;
});