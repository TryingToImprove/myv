define(["$", "underscore", "backbone", "marionette"], function ($, _, Backbone, Marionette) {

    // set up the app instance
    var App = new Marionette.Application();

    App.vent.on("views:show:home", function () {
        var app = this;
        require(["Views/HomeView"], function (HomeView) {
            app.mainRegion.show(new HomeView);
        })
    });

    App.addRegions({
        "mainRegion": {
            el: $("body")
        }
    });

    App.addInitializer(function () {
        this.vent.trigger("views:show:home");
    });

    // configuration, setting up regions, etc ...

    // export the app from this module
    return App;


});