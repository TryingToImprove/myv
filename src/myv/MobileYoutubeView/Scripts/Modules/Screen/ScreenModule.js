require(["$", "underscore", "backbone", "marionette", "Repository/ScreenRepository", "Modules/Screen/Controllers/NotificationController", "Modules/Screen/Controllers/ScreenController", "text!Templates/ViewerLayout.html"], function ($, _, Backbone, Marionette, ScreenRepository, NotificationController, ScreenController, LayoutTemplate) {

    //Load the App
    var App = require("App");

    //Define the screen module
    App.module("Screen", function (Screen) {
        Screen.addInitializer(function () {
            require(["Views/SelectScreenView"], function (SelectScreenView) {
                var controller = new SelectScreenView({ area: App.mainRegion });
                controller.showSelectScreen();
            });
        });

        // Used to display the video player
        Screen.listenTo(App, "views:show:viewer", function (screen) {
            require(["Models/ScreenModel"], function(ScreenModel) {
                App.model = new ScreenModel(screen);

                Screen.layout = new Layout();

                //Setup the notification controller
                Screen.notificationController = new NotificationController({
                    mainRegion: Screen.layout.notification
                });

                //Setup the screen/viwer controller
                Screen.screenController = new ScreenController({
                    mainRegion: Screen.layout.screen
                });

                //Display the layout
                App.mainRegion.show(Screen.layout);
            });
        });

        // Used to make it possible to show the same screen on multiple monitors
        Screen.listenTo(App, "screen:choose", function (screenId) {
            App.hub.server.joinScreen(screenId);
        });

        var Layout = Marionette.Layout.extend({
            template: LayoutTemplate,
            tagName: "div",
            regions: {
                screen: "#video-screen",
                notification: "#notification"
            }
        });

    });


});