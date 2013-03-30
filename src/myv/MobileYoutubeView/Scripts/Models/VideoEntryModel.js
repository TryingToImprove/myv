define(["underscore", "backbone"], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        idAttribute: "Id"
    });

    return Model;
});