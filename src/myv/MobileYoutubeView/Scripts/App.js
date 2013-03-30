define(["$", "underscore", "backbone", "marionette"], function ($, _, Backbone, Marionette) {

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

    App.vent.on("views:show:viwer", function () {
        throw new Error("Not implanted")
    });

    App.vent.on("views:show:remoteController", function () {
        require(["Views/RemoteControllerView"], function (RemoteControllerView) {
            App.mainRegion.show(new RemoteControllerView());
        });
    });

    App.addInitializer(function () {
        this.vent.trigger("views:show:home");
    });

    // configuration, setting up regions, etc ...

    // export the app from this module
    return App;


});