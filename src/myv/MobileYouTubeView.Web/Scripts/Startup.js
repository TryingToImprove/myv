require.config({
    basePath: "../Scripts",
    shim: {
        $: {
            exports: "jQuery"
        }
    },
    paths: {
        Handlebars: "Vendor/handlebars-1.0.rc.1",
        $: "Vendor/jquery.mobile-1.2.0",
        text: "Vendor/requirejs-plugins/text"
    }
});

define(["App"], function (App) {
    "use strict";
    App.start();
});