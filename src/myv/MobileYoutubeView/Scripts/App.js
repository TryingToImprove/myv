define(["$", "underscore", "backbone", "marionette", "Handlebars"], function ($, _, Backbone, Marionette, Handlebars) {

    Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
        return Handlebars.compile(rawTemplate);
    };

    var STATES = {
        VIEWER: 0,
        REMOTE_CONTROLLER: 1
    };

    // set up the app instance
    var App = new Marionette.Application();

    App.isPlaying = true;

    App.addRegions({
        mainRegion: "#main-content"
    });

    App.vent.on("views:show:home", function () {
        require(["Views/HomeView"], function (HomeView) {
            App.mainRegion.show(new HomeView());
        });
    });

    App.listenTo(App, "video:play", function (video) {
        App.isPlaying = true;
    });

    App.listenTo(App, "video:pause", function (video) {
        App.isPlaying = false;
    });

    App.listenTo(App, "volume:up", function () {
        if (App.volume <= 90) {
            App.volume += 10;
        } else if (App.volume > 90 && App.volume < 100) {
            App.volume = 100;
        }

        App.vent.trigger.apply(App, ["volume:changed", App.volume]);
    });

    App.listenTo(App, "volume:down", function () {
        if (App.volume >= 10) {
            App.volume -= 10;
        } else if (App.volume > 0 && App.volume < 10) {
            App.volume = 0;
        }

        App.vent.trigger.apply(App, ["volume:changed", App.volume]);
    });

    App.vent.listenTo(App, "video:request", function (id) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.splice(0, 0, "video:change");

        App.vent.trigger.apply(App, args);
    });

    App.vent.listenTo(App, "views:show:viewer", function (screen) {
        App.state = STATES.VIEWER;

        require(["Views/ViewerView"], function (ViewerView) {
            console.log("test");
            App.mainRegion.show(new ViewerView());
        });
    });

    App.vent.listenTo(App, "remoteController:choose", function (screenId) {
        App.hub.server.connectRemoteController(screenId);
    });
    
    App.vent.listenTo(App, "screen:choose", function (screenId) {
        App.hub.server.joinScreen(screenId);
    });

    App.vent.listenTo(App, "views:show:selectScreenView", function (screens) {
        require(["Views/SelectScreenView", "Models/ScreenModel", "Collections/ScreenCollection"], function (SelectScreenView, ScreenModel, ScreenCollection) {
            var screenModels = [],
                screenCollection;

            screens.forEach(function (currentScreen) {
                screenModels.push(new ScreenModel(currentScreen));
            });

            screenCollection = new ScreenCollection(screenModels);
            App.mainRegion.show(new SelectScreenView({ collection: screenCollection }));
        });
    });

    App.vent.listenTo(App, "views:show:chooseScreenView", function (screens) {
        require(["Views/ChooseScreenView", "Models/ScreenModel", "Collections/ScreenCollection"], function (ChooseScreenView, ScreenModel, ScreenCollection) {
            var screenModels = [],
                screenCollection;

            screens.forEach(function (currentScreen) {
                screenModels.push(new ScreenModel(currentScreen));
            });
            
            screenCollection = new ScreenCollection(screenModels);
            App.mainRegion.show(new ChooseScreenView({ collection: screenCollection }));
        });
    });

    App.vent.listenTo(App, "views:show:remoteController", function (remoteController, screen) {
        require(["Views/RemoteControllerView", "Models/RemoteControllerModel"], function (RemoteControllerView, RemoteControllerModel) {

            App.model = new RemoteControllerModel(remoteController);

            App.mainRegion.show(new RemoteControllerView());
        });
    });

    App.addInitializer(function () {
        this.vent.trigger("views:show:home");
    });

    App.addInitializer(function () {
        //We want the app to have 100 volume from init
        this.volume = 100;
    });

    App.hub = $.connection.mainHub;

    App.hub.client.publish = function () {
        console.log(arguments)
        App.vent.trigger.apply(App, arguments);
    };


    // configuration, setting up regions, etc ...

    // export the app from this module
    return App;


});