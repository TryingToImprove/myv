define(["$", "underscore", "backbone", "marionette", "text!Templates/ViewerView.html", "Models/PlayerModel"], function ($, _, Backbone, Marionette, Template, PlayerModel) {
    "use strict";

    var App = require("App");

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
        onDomRefresh: function () {
            // The HTML have been inserted to the document tree, so we can now embed the flash object
            this.embedSWF();
        },
        initialize: function (options) {
            //Create a player model
            this.player = new PlayerModel();

            this.listenTo(App, "video:ready", function () {
                // We want to be able to see if the viewer/player is ready to play a new video
                this.isReady = true;
            });
        },
        load: function (videoEntryModel) {
            //Call the load function on the playerModel
            this.player.load(videoEntryModel.get("Id"));
        },
        embedSWF: function () {
            //Embed the player
            this.player.embed();
        },
        getPlayerState: function() {
            return this.player.getPlayerState();
        },
        setVolume: function (volume) {
            this.player.setVolume(volume);
        },
        play: function () {
            this.player.play();
        },
        pause: function () {
            this.player.pause();
        }
    });

    return ScreenView;
});