define(["underscore", "backbone", "Models/ScreenModel"], function (_, Backbone, ScreenModel) {
    var App = require("App");

    var Collection = Backbone.Collection.extend({
        initialize: function () {
            this.listenTo(App, "data:screens:all:loaded", function (screens) {
                var screenModels = [],
                    screenCollection;
                console.log(screens)

                screens.forEach(function (currentScreen) {
                    screenModels.push(new ScreenModel(currentScreen));
                });

                this.reset(screenModels);
                console.log(this);
            });
        }
    });


    return Collection;
});