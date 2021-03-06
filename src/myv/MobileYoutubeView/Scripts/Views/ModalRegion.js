﻿define(["$", "underscore", "backbone", "marionette"], function($, _, Backbone, Marionette) {
    var Region = Marionette.Region.extend({
        el: "#modal",
        constructor: function() {
            _.bindAll(this);
            Marionette.Region.prototype.constructor.apply(this, arguments);
            this.on("show", this.showModal, this);
        },
        getEl: function(selector) {
            var $el = $(selector);
            $el.on("hidden", this.close);
            return $el;
        },
        showModal: function (view) {
            view.on("close", this.hideModal, this);
            $("#disabler").show();
            this.$el.addClass("active").fadeIn();
        },
        hideModal: function () {
            $("#disabler").hide();
            this.$el.removeClass("active").fadeOut();
        }
    });

    return Region;
});