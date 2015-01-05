(function($, _, Template){

  var app = {
    model: {}
  , collection: {}
  , view: {}
  , util: {}
  , router: {}
  };


  app.util.template = function(id) {
    return Template.compile($('#' + id).html());
  };

  app.model.Node = Backbone.Model.extend({
    urlRoot: '/api/nodes'
  });

  app.collection.Node = Backbone.Collection.extend({
    model: app.model.Node,
    url: '/api/nodes'
  })
  app.view.MainNode = Backbone.View.extend({
    model: app.model.Node
  });

  app.view.NodeCard = Backbone.View.extend({
    className: "node-card"
  , template: app.util.template('node-card-template')
  , render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  app.view.NodeSmallCard = Backbone.View.extend({
    className: "node-small-card"
  });

  app.view.NodePage = Backbone.View.extend({
    className: 'node-page'
  });

  var MainApp = Backbone.Router.extend({
    routes: {
      '': "index"
    , 'i/notification': 'notification'
    , 'i/discover': 'discover'
    }
  , initialize: function (options) {
    }
  , index: function() {
  var node = new app.model.Node({title: 'Title', content: 'Hello World'});
  node.save();
  var nodes = new app.collection.Node();
  console.log(nodes.fetch())
    }
  , notification: function () {
    }
  , discover: function() {
    }
  });

  app.router.mainApp = new MainApp();
  Backbone.history.start({pushState: true});
})(jQuery, _, Handlebars);
