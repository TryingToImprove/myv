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
        "$signalR": ['$'],
        "/signalr/hubs": ['$', '$signalR']
    },
    paths: {
        underscore: "Vendor/Underscore/Underscore",
        backbone: "Vendor/Backbone/Backbone",
        marionette: "Vendor/backbone/backbone.marionette",
        "backbone.wreqr": "Vendor/Backbone/backbone.wreqr",
        "backbone.babysitter": "Vendor/Backbone/Backbone.babysitter",
        Handlebars: "Vendor/handlebars-1.0.rc.1",
        $: "Vendor/jquery.mobile-1.2.0",
        $signalR: "Vendor/jquery.signalR-1.0.1",
        Templates: "../Templates",
        text: "Vendor/requirejs-plugins/text"
    }
});

define(["$", "App", "Handlebars", "/signalr/hubs"], function ($, App, Handlebars, hubs) {
    "use strict";
    $(function () {
        $.connection.hub.start({
            waitForPageLoad: false
        }).done(function () {
            window._app = App;

            App.start();
        });
    });
});