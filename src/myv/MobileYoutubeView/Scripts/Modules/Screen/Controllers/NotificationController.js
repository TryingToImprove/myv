define(["$", "underscore", "backbone", "marionette", "text!Templates/NotificationView.html", "Models/NotificationModel"], function ($, _, Backbone, Marionette, NotificationViewTemplate, NotificationModel) {

    var App = require("App"),

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                this.mainRegion = options.mainRegion;

                this.listenTo(App, "video:change", function (video) {
                    require(["Models/VideoEntryModel"], $.proxy(function (VideoEntryModel) {
                        this.show(Controller.Types.DEFAULT, {
                            model: new VideoEntryModel(video)
                        });
                    }, this));
                });

                this.listenTo(App, "volume:changed", function (volume) {
                    this.show(Controller.Types.VOLUME, {
                        volume: volume
                    });
                });
            },
            show: function (type, options) {
                switch (type) {
                    //Display a notification of what is being played
                    case Controller.Types.DEFAULT:
                        this.mainRegion.show(new NotificationView({
                            model: new NotificationModel({
                                Message: "Now playing: " + options.model.get("Title")
                            }),
                            displayLength: 6000
                        }));
                        break;
                    
                    //Display a notification of how high the volume is
                    case Controller.Types.VOLUME:
                        this.mainRegion.show(new NotificationView({
                            model: new NotificationModel({
                                Message: "Volume: " + options.volume
                            }),
                            displayLength: 6000
                        }));
                        break;
                }
            }
        }),
        
        //TODO: This should be in a seperate file
        NotificationView = Backbone.Marionette.ItemView.extend({
            template: NotificationViewTemplate,
            tagName: "div",
            className: "notification",
            displayLength: 1500,
            initialize: function (options) {
                options = options || {};

                if (options.displayLength) {
                    this.displayLength = options.displayLength;
                }
            },
            onShow: function () {
                this.$el.fadeIn();

                setTimeout($.proxy(function () {
                    this.$el.fadeOut();
                }, this), this.displayLength);
            }
        });

    Controller.Types = {
        DEFAULT: 0,
        VOLUME: 1
    };

    return Controller;
});