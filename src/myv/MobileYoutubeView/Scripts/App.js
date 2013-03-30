define(["$", "underscore", "backbone", "marionette"], function ($, _, Backbone, Marionette) {

    var STATES = {
        VIEWER: 0,
        REMOTE_CONTROLLER: 1
    };

    // set up the app instance
    var App = new Marionette.Application();

    App.addRegions({
        mainRegion: "#main-content"
    });

    App.vent.on("views:show:home", function () {
        require(["Views/HomeView"], function (HomeView) {
            App.mainRegion.show(new HomeView());
        });
    });

    App.vent.listenTo(App, "video:request", function (id) {
        if (App.state == STATES.VIEWER) {

            alert("TEST");

            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, "video:change");

            App.vent.trigger.apply(App, args);
        }
    });

    App.vent.on("views:show:viewer", function () {
        App.state = STATES.VIEWER;

        require(["Views/ViewerView"], function (ViewerView) {
            App.mainRegion.show(new ViewerView());
        });
    });

    App.vent.on("views:show:remoteController", function () {
        App.state = STATES.REMOTE_CONTROLLER;

        require(["Views/RemoteControllerView"], function (RemoteControllerView) {
            App.mainRegion.show(new RemoteControllerView());
        });
    });

    App.addInitializer(function () {

        this.vent.trigger("views:show:home");
    });
    App.hub = $.connection.mainHub;

    App.hub.client.publish = function () {
        console.log("trigger:" + arguments[0]);
        App.vent.trigger.apply(App, arguments);
    };


    // configuration, setting up regions, etc ...

    // export the app from this module
    return App;


});