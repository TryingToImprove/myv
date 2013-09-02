define(["$", "underscore", "backbone", "marionette", "text!Templates/NotificationView.html", "Models/NotificationModel"], function ($, _, Backbone, Marionette, NotificationViewTemplate, NotificationModel) {

    var App = require("App"),
        Controller = Marionette.Controller.extend({
            model: null,
            initialize: function (options) {
                var that = this,
                    mainRegion = this.mainRegion = options.mainRegion;

                this.listenTo(App, "video:change", function (videoDto) {
                    require(["Models/VideoEntryModel"], $.proxy(function (VideoEntryModel) {
                        this.model = new VideoEntryModel(videoDto);

                        // If there is no player/viewerView, we want to create it,
                        if (!this.player) {
                            require(["Views/ViewerView"], $.proxy(function (ViewerView, VideoEntryModel) {
                                //Create the player view
                                this.player = viewerView = new ViewerView();

                                //Display the view
                                mainRegion.show(viewerView);
                            }, this));
                        } else {
                            this.start(this.model);
                        }
                    }, this));
                });

                this.listenTo(App, "volume:changed", function (volume) {
                    this.changeVolume(volume);
                });

                this.listenTo(App, "video:play", function () {
                    this.play();
                });

                this.listenTo(App, "video:ready", $.proxy(function (player) {
                    this.start(this.model);

                    App.hub.server.videoStarted(this.model.get("id"));
                }, this));

                this.listenTo(App, "video:pause", function () {
                    this.pause();
                });
            },
            changeVolume: function (volume) {
                this.player.setVolume(volume);
            },
            play: function () {
                if (this.player.getPlayerState() !== 1) {
                    this.player.play();
                }
            },
            pause: function () {
                if (this.player.getPlayerState() === 1) {
                    this.player.pause();
                }
            },
            start: function (videoEntryModel) {
                //Load the video into the player
                this.player.load(videoEntryModel);
            }
        });

    window.onYouTubePlayerReady = function () {
        //Find the YouTube-flash plasyer, and add a stateChane event
        var player = document.getElementById("myytplayer");
        player.addEventListener('onStateChange', 'onYouTubePlayerStateChange');

        //The player is ready to be used now
        App.trigger("video:ready", player);
    };

    // This function is not in use
    window.onYouTubePlayerStateChange = function (state) {
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

        stateEvents[state]();
    };

    return Controller;
});