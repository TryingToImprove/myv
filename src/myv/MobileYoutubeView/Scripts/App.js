define(["$", "underscore", "backbone", "marionette", "Handlebars", "Views/ModalRegion"], function ($, _, Backbone, Marionette, Handlebars, ModalRegion) {

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
        modal: ModalRegion,
        mainRegion: "#main-content"
    });

    //Define a function which will be used whenever there is need for a modal to be shown
    App.displayModal = function(view) {
        this.modal.show(view);
    };

    App.vent.listenTo(App, "views:show:home", function () {
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

    App.vent.listenTo(App, "screen:start", function (screen) {
        App.state = STATES.VIEWER;
    });

    App.vent.listenTo(App, "remoteController:choose", function (screenId) {
        App.hub.server.connectRemoteController(screenId);
    });

    App.Data = {};

    App.vent.listenTo(App, "screen:start", function (screens) {
        require(["Modules/Screen/ScreenModule"], function (ScreenModule) {
            App.module("Screen").stop();
            App.module("Screen").start();
        });
    });

    App.vent.listenTo(App, "views:show:chooseScreenView", function (screens) {
        require(["Views/ChooseScreenView"], function (ChooseScreenView) {
            App.mainRegion.show(new ChooseScreenView());
        });
    });

    App.vent.listenTo(App, "views:show:remoteController", function (remoteController, screen) {
        require(["Views/RemoteControllerView", "Models/RemoteControllerModel"], function (RemoteControllerView, RemoteControllerModel) {
            App.model = new RemoteControllerModel(remoteController);

            App.mainRegion.show(new RemoteControllerView());
        });
    });

    App.addInitializer(function () {
        require(["Repository/ScreenRepository"], function(ScreenRepository) {
            App.trigger("views:show:home");
        });
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