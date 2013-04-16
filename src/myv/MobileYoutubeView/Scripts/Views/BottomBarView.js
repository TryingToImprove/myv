define(["$", "underscore", "backbone", "marionette", "text!Templates/BottomBar.html", "text!Templates/BottomBar-Playing.html"], function ($, _, Backbone, Marionette, LayoutTemplate, PlayingTemplate) {
    var App = require("App");

    var Layout = Backbone.Marionette.Layout.extend({
        template: LayoutTemplate,
        tagName: "aside",
        className: "playing-container",
        ui: {
            content: ".content",
            options: ".options"
        },
        events: {
            "click .options > .dots": "openContent",
        },
        regions: {
            content: "#remoteController-bottom-content-area"
        },
        initialize: function () {
            this.listenTo(App, "video:change", function (video) {
                require(["Models/VideoEntryModel"], $.proxy(function (VideoEntryModel) {
                    this.content.show(new PlayingView({
                        model: new VideoEntryModel(video)
                    }));

                    //If it is open then we need to resize the bar
                    if (this.isContentOpen)
                        this.resize();
                }, this));
            });
        },
        isContentOpen: false,
        resize: function () {
            var contentHeight = this.ui.content.outerHeight(true),
                optionsHeight = this.ui.options.outerHeight(true);

            this.$el.height((optionsHeight + contentHeight) + "px");
        },
        openContent: function (e) {
            var optionsHeight = this.ui.options.outerHeight(true),
                contentHeight;

            if (this.isContentOpen) {
                this.ui.content.hide();
                this.$el.height(optionsHeight + "px");
            } else {
                this.ui.content.show();

                contentHeight = this.ui.content.outerHeight(true);

                this.$el.height((optionsHeight + contentHeight) + "px");
            }

            this.isContentOpen = !this.isContentOpen;

            e.preventDefault();
        }
    });

    var PlayingView = Backbone.Marionette.ItemView.extend({
        template: PlayingTemplate,
        tagName: "aside",
        ui: {
            btnPlayPause: ".playPause-btn"
        },
        events: {
            "click .playPause-btn ": "playPause",
            "click .volume-up": "volumeUp",
            "click .volume-down": "volumeDown"
        },
        initialize: function () {
            this.listenTo(App, "video:play", function (video) {
                this.ui.btnPlayPause
                    .removeClass("paused")
                    .addClass("playing");
            });

            this.listenTo(App, "video:pause", function (video) {
                this.ui.btnPlayPause
                    .removeClass("playing")
                    .addClass("paused");
            });
        },
        volumeUp: function () {
            App.hub.server.sendVolumeUp();
        },
        volumeDown: function () {
            App.hub.server.sendVolumeDown();
        },
        playPause: function (e) {

            if (App.isPlaying === null) {
                console.log("waiting...");
                e.preventDefault();
                return false;
            } else if (App.isPlaying === true) {
                App.hub.server.sendPauseRequest();
            } else if(App.isPlaying === false) {
                App.hub.server.sendPlayRequest();
            }

            App.isPlaying = null;
            e.preventDefault();
            return false;
        }
    });


    return Layout;
});