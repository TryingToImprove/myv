require.config({
    basePath: "../Scripts",
    shim: {
        Handlebars: {
            exports: "Handlebars"
        },
        $: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['$', 'underscore'],
            exports: 'Backbone'
        },
        marionette: {
            deps: ['$', 'underscore', 'backbone'],
            exports: 'Marionette'
        },
        SignalR: {
            deps: ["$"]
        },
        "/signalr/hubs": ['$', 'SignalR'],
        App: {
            deps: ["/signalr/hubs"]
        }
    },
    paths: {
        underscore: "Vendor/Underscore/Underscore",
        backbone: "Vendor/Backbone/Backbone",
        marionette: "Vendor/backbone/backbone.marionette",
        "backbone.wreqr": "Vendor/Backbone/backbone.wreqr",
        "backbone.babysitter": "Vendor/Backbone/Backbone.babysitter",
        Handlebars: "Vendor/handlebars-1.0.rc.1",
        $: "Vendor/jquery.mobile-1.2.0",
        SignalR: "Vendor/jquery.signalR-1.0.1",
        Templates: "../Templates",
        text: "Vendor/requirejs-plugins/text"
    }
});

define(["$", "SignalR", "/signalr/hubs", "App"], function ($, SignalR, hubs, App) {
    "use strict";

    $.connection.hub.start({ waitForPageLoad: false }).done(function () {
        window._app = App;

        App.start();
    });
});