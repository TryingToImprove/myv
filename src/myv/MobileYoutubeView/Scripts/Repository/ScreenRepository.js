define(["Models/ScreenModel", "Collections/ScreenCollection"], function (ScreenModel, ScreenCollection) {

    var App = require("App");

    App.listenTo(App, "data:screens:all:load", function () {
        App.hub.server.getOnlineScreens();
    });

    App.listenTo(App, "data:screens:all:loaded", function (screens) {
        var screenCollection = App.Data.Screens;

        if (screenCollection) {
            App.Data.Screens.reset(screens);
        } else {
            var screenModels = [];

            screens.forEach(function (currentScreen) {
                screenModels.push(new ScreenModel(currentScreen));
            });

            screenCollection = new ScreenCollection(screenModels);

            App.Data.Screens = screenCollection;
        }

        App.trigger("data:screens:currentConnected");
    });
    
    App.listenTo(App, "screen:joined", function(screen) {
        var screenCollection = App.Data.Screens;

        if (screenCollection) {
            screenJoined(screen);
        }
    });

    App.listenTo(App, "data:screens:createNew", function(screen) {
        //Connect the screen
        App.hub.server.connectScreen(screen.get("Name"));
    });

    function screenJoined(screen) {
        if (App.Data.Screens != null) {
            var screenModel = new ScreenModel(screen);
            App.Data.Screens.add(screenModel);
        }
    }

});