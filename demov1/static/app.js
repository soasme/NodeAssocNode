(function($, _, Template, md2html){

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
    urlRoot: '/api/nodes',

    html: function () {
      return md2html(this.get('data').content)
    },

    expose: function () {
      var json = this.toJSON()
      json.html = this.html()
      return json
    }
  })

  app.collection.Node = Backbone.Collection.extend({
    model: app.model.Node,
    url: '/api/nodes'
  })

  app.view.MainNode = Backbone.View.extend({
    className: "main-node",
    model: app.model.Node,
    template: app.util.template('main-node-template'),
    render: function () {

    }
  })

  app.view.NodeCard = Backbone.View.extend({
    className: "node-card",
    model: app.model.Node,
    template: app.util.template('node-card-template'),
    render: function () {
      var data = this.model.expose()
      var html = this.template(data)
      this.$el.html(html)
      return this
    }
  })

  app.view.NodePage = Backbone.View.extend({
    className: 'node-page',
    template: app.util.template('node-page-template'),
    appendNodeCard: function(node) {
      var view = new app.view.NodeCard({model: node})
      $(".node-page .cascade-section").append(view.render().el)
    },
    renderCascadeSection: function() {
      var col = new app.collection.Node()
      var $list = $(".node-page .cascade-section")
      var appender = this.appendNodeCard
      col.fetch({reset: true}).done(function(resp) {
        col.each(appender)
      })
    },
    renderNodeSection: function() {

    },
    renderSkelenton: function() {
      this.$el.html(this.template())
    },
    render: function() {
      this.renderSkelenton()
      this.renderCascadeSection()
      this.renderNodeSection()
      return this
    }
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
      var nodes = new app.collection.Node()
    },

    nodeView: function (id) {
      var nodePageView = new app.view.NodePage()
      $("#app-endpoint").html(nodePageView.render().el)
    }
  })

  app.router.mainApp = new MainApp()

  Backbone.history.start({pushState: false})

})(jQuery, _, Handlebars, marked);
