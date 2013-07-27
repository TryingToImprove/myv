define(["$", "underscore", "backbone", "marionette", "text!Templates/ViewerLayout.html", "text!Templates/ViewerView.html", "text!Templates/NotificationView.html", "Models/NotificationModel"], function ($, _, Backbone, Marionette, LayoutTemplate, Template, NotificationViewTemplate, NotificationModel) {
    var App = require("App");

    var Layout = Backbone.Marionette.Layout.extend({
        template: LayoutTemplate,
        tagName: "div",
        regions: {
            screen: "#video-screen",
            notification: "#notification"
        },
        onShow: function () {
            var screenView = new ScreenView();
            screenView.parent = this,
            this.screen.show(screenView);
        }
    });


    var ScreenView = Backbone.Marionette.ItemView.extend({
        template: Template,
        tagName: "div",
        className: "viewer",
        events: {
            "click [data-videoId]": "sendVideoRequest"
        },
        ui: {
            player: "#player"
        },
        initialize: function () {
            this.listenTo(App, "video:change", function (video) {
                var videoId = video.Id;

                require(["Models/VideoEntryModel"], $.proxy(function (VideoEntryModel) {
                    this.model = new VideoEntryModel(video);
                    
                    //Display a notification of what is being played
                    this.parent.notification.show(new NotificationView({
                        model: new NotificationModel({
                            Message: "Now playing: " + this.model.get("Title")
                        }),
                        displayLength: 6000
                    }));

                    this.render();
                }, this));

            });

            this.listenTo(App, "volume:changed", function (volume) {
                this.player.setVolume(volume);
                
                this.parent.notification.show(new NotificationView({
                    model: new NotificationModel({
                        Message: "Volume: " + volume
                    })
                }));
            });

            this.listenTo(App, "video:play", function () {
                this.play();
            });

            this.listenTo(App, "video:pause", function () {
                this.pause();
            });
        },
        onRender: function () {
            this.embedSWF();
        },
        embedSWF: function () {
            var params = {
                allowScriptAccess: "always"
            },
            url = "http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=myytplayer",
                atts = {
                    id: "myytplayer"
                };

            swfobject.embedSWF(url, "ytapiplayer", "100%", "100%", "8", null, null, params, atts);

            window.onYouTubePlayerReady = (function (view) {
                return function () {
                    view.start();
                };
            }(this));

            window.onYouTubePlayerStateChange = (function (view) {
                return function (state) {
                    var stateEvents = {
                        "-1": function () {
                            //alert("Not ready");
                        },
                        "0": function () {
                            //view.playNext();
                        },
                        "1": function () {
                            //view.video.duration = view.player.getDuration();
                            //view.updateProgess();
                        },
                        "2": function () {
                            //alert("paused");
                        },
                        "3": function () {
                            //alert("buffering");
                        },
                        "5": function () {
                            //alert("video cued");
                        }
                    };

                    clearTimeout(view.progessInterval);

                    stateEvents[state]();
                };
            }(this));
        },
        play: function () {
            if (this.player.getPlayerState() !== 1) {
                this.player.playVideo();
            }
        },
        pause: function () {
            if (this.player.getPlayerState() === 1) {
                this.player.pauseVideo();
            }
        },
        start: function () {
            var id = this.model.get("Id");

            this.player = document.getElementById("myytplayer");
            this.player.addEventListener('onStateChange', 'onYouTubePlayerStateChange');

            this.player.loadVideoById(id, 0, 0);
        }
    });

    var NotificationView = Backbone.Marionette.ItemView.extend({
        template: NotificationViewTemplate,
        tagName: "div",
        className: "notification",
        displayLength: 1500,
        initialize: function (options) {
            options = options || {};

            if (options.displayLength) {
                this.displayLength = options.displayLength;
            }
        },
        onShow: function () {
            this.$el.fadeIn();

            setTimeout($.proxy(function() {
                this.$el.fadeOut();
            },this), this.displayLength);
        }
    });

    return Layout;
});