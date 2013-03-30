define(
    ["$", "Vendor/EventManager"],
    function ($, EventManager) {
        "use strict";

        
        function App() {
            this.vent = new EventManager()  ;
            
            this.buildRoutes();
        }

        App.prototype.buildRoutes = function () {
            var that = this;

            this.vent.subscribe("view:show:gameView", function () {
                require(["Views/GamePlayView"], function (GamePlayView) {
                    var gameView = new GamePlayView();

                });
            });
        };

        App.prototype.start = function () {
            //this.user = this.dataManager.load().user;

            this.vent.publish("view:show:gameView");

        };


        return new App();
    }
);