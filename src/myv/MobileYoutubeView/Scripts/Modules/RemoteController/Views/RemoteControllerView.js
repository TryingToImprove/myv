define(["$", "underscore", "backbone", "marionette", "text!RemoteController/Templates/RemoteControllerView.html", "text!RemoteController/Templates/RemoteControllerView-Item.html", "text!RemoteController/Templates/RemoteControllerView-Layout.html", "text!RemoteController/Templates/RemoteControllerView-Search.html", "text!RemoteController/Templates/RemoteControllerView-Loading.html", "RemoteController/Views/BottomBarView"], function ($, _, Backbone, Marionette, Template, ItemViewTemplate, LayoutTemplate, SearchTemplate, LoadingTemplate, BottomBarView) {
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

            this.listenTo(App, "current:screen:disconnected", function (screen) {
                require(["RemoteController/Views/DisconnectedView"], function (DisconnectedView) {
                    App.displayModal(new DisconnectedView());
                });
            });
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
            App.hub.server.sendVideoRequest(videoId, App.model.toJSON());
        },
    });

    var SearchView = Backbone.Marionette.ItemView.extend({
        template: SearchTemplate,
        tagName: "form",
        events: {
            "change input[name='txtSearch']": "autoComplete",
            "click #remoteController-search-autoComplete": "searchAuto",
            "submit": "search"
        },
        ui: {
            txtSearch: "input[name='txtSearch']",
            autoComplete: ".dropdown"
        },
        searchTimeoutFunc: null,
        searchAuto: function (e) {
            var $target = $(e.target),
                value = $target.html();

            this.ui.txtSearch.val(value);
            this.ui.autoComplete.hide();
            this.search();
        },
        autoComplete: function () {

            if (this.searchTimeoutFunc)
                clearTimeout(this.searchTimeoutFunc);

            this.searchTimeoutFunc = setTimeout($.proxy(function () {

                $.ajax({
                    url: "/Api/YouTubeSuggestion?query=" + this.ui.txtSearch.val(),
                    dataType: "json"
                })
                .done($.proxy(function (result) {
                    var $autoCompleteList = this.ui.autoComplete.find("ul").empty();
                    console.log(result.length);
                    //If there are no result, then we want to hide the autocomplete-dropdown and stop the executing
                    if (result.length == 0) {
                        this.ui.autoComplete.hide();
                        return;
                    }

                    this.ui.autoComplete.show();
                    
                    result.forEach(function (item) {
                        $("<li>" + item + "</li>").appendTo($autoCompleteList);
                    });

                }, this));
            }, this), 400);

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