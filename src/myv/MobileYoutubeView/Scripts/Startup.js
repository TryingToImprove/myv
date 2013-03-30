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
        Templates: "../Templates",
        text: "Vendor/requirejs-plugins/text"
    }  
});

define(["App", "Handlebars"], function (App, Handlebars) {
    "use strict";

    window._app = App;

    App.start();
});