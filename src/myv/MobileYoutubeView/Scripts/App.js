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

    App.vent.listenTo(App, "video:change", function (id) {
        if (App.state == STATES.VIEWER) {
            alert(id);
        }
    });

    App.vent.on("views:show:viewer", function () {
        App.state = STATES.VIEWER;
        //throw new Error("Not implanted")
    });

    App.vent.on("views:show:remoteController", function () {

        App.state = STATES.REMOTE_CONTROLLER;

        require(["Views/RemoteControllerView"], function (RemoteControllerView) {
            App.mainRegion.show(new RemoteControllerView());
        });
    });

    App.addInitializer(function () {
        this.hub.server.hello();
        this.vent.trigger("views:show:home");
    });

    App.hub = $.connection.mainHub;

    App.hub.client.publish = function () {
        console.log("Publish trigger: ", arguments[0]);
        App.vent.trigger.apply(App, arguments);
    };
    
    // configuration, setting up regions, etc ...

    // export the app from this module
    return App;


});