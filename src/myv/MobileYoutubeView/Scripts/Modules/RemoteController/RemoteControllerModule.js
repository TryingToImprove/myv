require(["$", "underscore", "backbone", "marionette", "Repository/ScreenRepository"], function ($, _, Backbone, Marionette, ScreenRepository, LayoutTemplate) {

    //Load the App
    var App = require("App"),
        RequirePrefix = "Modules/RemoteController/",
        GetAbsolutePath = function (relativePath) {
            return RequirePrefix + relativePath;
        };

    //Define the screen module
    App.module("RemoteController", function (RemoteController) {

        // When the RemoteController App start we want to displa the SelectScreenView, so the client
        // can select which screen to control
        RemoteController.addInitializer(function () {
            require(["RemoteController/Views/SelectScreenView"], function (SelectScreenView) {
                App.mainRegion.show(new SelectScreenView());
            });
        });

        // Listen to the show remotecontroller event to display the controller view
        this.listenTo(App, "views:show:remoteController", function (remoteController, screen) {
            require(["RemoteController/Views/RemoteControllerView", "Models/RemoteControllerModel"], function (RemoteControllerView, RemoteControllerModel) {
                
                App.model = new RemoteControllerModel(remoteController);

                App.mainRegion.show(new RemoteControllerView());
            });
        });

    });

});