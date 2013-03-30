define(["underscore", "backbone"], function (_, Backbone) {
    var Collection = Backbone.Collection.extend({
        url: "/api/YouTube"
    });
    
    
    return Collection;
});