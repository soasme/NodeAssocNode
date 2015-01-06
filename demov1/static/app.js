(function($, _, Template){

  var app = {
    model: {},
    collection: {},
    view: {},
    util: {},
    router: {}
  }

  app.util.template = function (id) {
    return Template.compile(
      $('#' + id).html()
    )
  }

  app.model.Node = Backbone.Model.extend({
    urlRoot: '/api/nodes'
  })

  app.collection.Node = Backbone.Collection.extend({
    model: app.model.Node,
    url: '/api/nodes'
  })

  app.view.MainNode = Backbone.View.extend({
    model: app.model.Node
  })

  app.view.NodeCard = Backbone.View.extend({
    className: "node-card",
    template: app.util.template('node-card-template'),
    render: function () {
      this.$el.html(
        this.template(
          this.model.attributes
        )
      )
      return this
    }
  })

  app.view.NodeSmallCard = Backbone.View.extend({
    className: "node-small-card"
  })

  app.view.NodePage = Backbone.View.extend({
    className: 'node-page'
  })

  var MainApp = Backbone.Router.extend({
    routes: {
      '': "index",
      'i/notification': 'notificationView',
      'i/discover': 'discoverView',
      'i/node/:id': 'nodeView'
    },

    initialize: function (options) {
    },

    index: function() {
      // Jump to node 1000001
      this.navigate("i/node/1000001")
    },

    notificationView: function () {
    },

    discoverView: function() {
    },

    nodeView: function (id) {
      var node = new app.model.Node({id: id})
      node.fetch({
        success: function (model, response, options) {
          console.log(model)
        }
      })
    }
  })

  app.router.mainApp = new MainApp()

  Backbone.history.start({pushState: false})

})(jQuery, _, Handlebars);
