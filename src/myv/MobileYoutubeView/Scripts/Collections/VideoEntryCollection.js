define(["underscore", "backbone"], function (_, Backbone) {
    var Collection = Backbone.Collection.extend({
        url: "/api/YouTubeVideo"
    });
    
    
    return Collection;
});