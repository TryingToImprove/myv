define(["underscore", "backbone"], function (_, Backbone) {
    "use strict";

    var playerId = "myytplayer";

    var Model = Backbone.Model.extend({
        idAttribute: "Id",
        defaults: {
            params: {
                allowScriptAccess: "always"
            },
            url: "http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=" + playerId,
            atts: {
                id: playerId
            },
            playerElement: null
        },
        getPlayerElement: function () {
            return document.getElementById(playerId);
        },
        load: function (id) {
            this.getPlayerElement().loadVideoById(id, 0, 0);
        },
        setVolume: function (volume) {
            this.getPlayerElement().setVolume(volume);
        },
        play: function () {
            this.getPlayerElement().playVideo();
        },
        pause: function () {
            this.getPlayerElement().pauseVideo();
        },
        getPlayerState: function () {
            return this.getPlayerElement().getPlayerState();
        },
        embed: function () {
            var url = this.get("url"),
                params = this.get("params"),
                atts = this.get("atts");

            //Create the flash-object
            swfobject.embedSWF(url, "ytapiplayer", "100%", "100%", "8", null, null, params, atts);
        }
    });

    return Model;
});